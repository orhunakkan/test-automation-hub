package com.testautomationhub.selenium.tests.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.testautomationhub.selenium.support.AccessToken;
import com.testautomationhub.selenium.support.Config;
import com.testautomationhub.selenium.support.SignIn;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

class MeTest {

  private String token;

  @AfterEach
  void revokeToken() {
    if (token != null) {
      AccessToken.revoke(token);
    }
  }

  @Test
  void whoAmIByCookie() {
    given()
        .baseUri(Config.get("baseUrl"))
        .cookie("__Host-session", SignIn.sessionCookie("member"))
        .when()
        .get("/api/me")
        .then()
        .statusCode(200)
        .body("username", equalTo(Config.get("memberUsername")))
        .body("via", equalTo("cookie"));
  }

  @Test
  void whoAmIByToken() {
    token = AccessToken.create("member");
    given()
        .baseUri(Config.get("baseUrl"))
        .auth()
        .oauth2(token)
        .when()
        .get("/api/me")
        .then()
        .statusCode(200)
        .body("username", equalTo(Config.get("memberUsername")))
        .body("via", equalTo("token"));
  }
}
