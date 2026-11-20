package com.testautomationhub.selenium.tests.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.startsWith;

import com.testautomationhub.selenium.support.Config;
import io.restassured.http.ContentType;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

class TokensTest {

  private String token;

  @AfterEach
  void revokeToken() {
    if (token != null) {
      given()
          .baseUri(Config.get("baseUrl"))
          .auth()
          .oauth2(token)
          .contentType(ContentType.JSON)
          .body(Map.of("intent", "revoke"))
          .post("/api/tokens/current");
    }
  }

  @Test
  void memberCreatesAToken() {
    token =
        given()
            .baseUri(Config.get("baseUrl"))
            .contentType(ContentType.JSON)
            .body(
                Map.of(
                    "username",
                    Config.get("memberUsername"),
                    "password",
                    Config.get("memberPassword"),
                    "name",
                    "api-test-" + System.currentTimeMillis(),
                    "expiresInDays",
                    1))
            .when()
            .post("/api/tokens")
            .then()
            .statusCode(201)
            .body("token", startsWith("folio_at_"))
            .body("tokenType", equalTo("Bearer"))
            .extract()
            .path("token");
  }
}
