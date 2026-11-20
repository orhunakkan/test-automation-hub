package com.testautomationhub.selenium.support;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;

public final class SignIn {

  private static final String SESSION_COOKIE = "__Host-session";
  private static final HttpClient HTTP =
      HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();

  private SignIn() {}

  public static void as(WebDriver driver, String user) {
    String session = sessionCookie(user);
    driver.get(Config.get("baseUrl") + "/robots.txt");
    driver
        .manage()
        .addCookie(
            new Cookie.Builder(SESSION_COOKIE, session)
                .path("/")
                .isSecure(true)
                .isHttpOnly(true)
                .sameSite("Lax")
                .build());
  }

  public static String sessionCookie(String user) {
    URI base = URI.create(Config.get("baseUrl"));
    String form =
        "username="
            + encode(Config.get(user + "Username"))
            + "&password="
            + encode(Config.get(user + "Password"));
    HttpRequest request =
        HttpRequest.newBuilder(base.resolve("/login"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Origin", base.getScheme() + "://" + base.getAuthority())
            .POST(HttpRequest.BodyPublishers.ofString(form))
            .build();
    HttpResponse<Void> response = send(request);
    String location = response.headers().firstValue("location").orElse("");
    if (!location.equals("/library")) {
      throw new IllegalStateException(
          "Sign-in failed: POST /login returned "
              + response.statusCode()
              + ", redirecting to "
              + location);
    }
    return response.headers().allValues("set-cookie").stream()
        .filter(header -> header.startsWith(SESSION_COOKIE + "="))
        .map(header -> header.substring(SESSION_COOKIE.length() + 1, header.indexOf(';')))
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("Sign-in failed: no session cookie"));
  }

  private static String encode(String value) {
    return URLEncoder.encode(value, StandardCharsets.UTF_8);
  }

  private static HttpResponse<Void> send(HttpRequest request) {
    try {
      return HTTP.send(request, HttpResponse.BodyHandlers.discarding());
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException(e);
    }
  }
}
