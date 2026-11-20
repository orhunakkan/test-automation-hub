package com.testautomationhub.selenium.support;

import static io.restassured.RestAssured.given;

import io.restassured.http.ContentType;
import io.restassured.response.Response;
import java.util.Map;

public final class AccessToken {

  private AccessToken() {}

  public static String create(String user) {
    Response response =
        given()
            .baseUri(Config.get("baseUrl"))
            .contentType(ContentType.JSON)
            .body(
                Map.of(
                    "username",
                    Config.get(user + "Username"),
                    "password",
                    Config.get(user + "Password"),
                    "name",
                    "api-test-" + System.currentTimeMillis(),
                    "expiresInDays",
                    1))
            .post("/api/tokens");
    if (response.statusCode() != 201) {
      throw new IllegalStateException(
          "Token creation failed: POST /api/tokens returned " + response.statusCode());
    }
    return response.path("token");
  }

  public static void revoke(String token) {
    given()
        .baseUri(Config.get("baseUrl"))
        .auth()
        .oauth2(token)
        .contentType(ContentType.JSON)
        .body(Map.of("intent", "revoke"))
        .post("/api/tokens/current");
  }
}
