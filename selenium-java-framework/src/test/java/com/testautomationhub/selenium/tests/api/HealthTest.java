package com.testautomationhub.selenium.tests.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.testautomationhub.selenium.support.Config;
import org.junit.jupiter.api.Test;

class HealthTest {

  @Test
  void healthCheckAnswersOk() {
    given()
        .baseUri(Config.get("baseUrl"))
        .when()
        .get("/healthz")
        .then()
        .statusCode(200)
        .body(equalTo("ok"));
  }
}
