package com.testautomationhub.selenium.tests.api;

import static io.restassured.RestAssured.given;

import com.testautomationhub.selenium.support.Config;
import org.junit.jupiter.api.Test;

class LoginTest {

  @Test
  void signInWithoutAnOriginHeaderIsRefused() {
    given().baseUri(Config.get("baseUrl")).when().post("/login").then().statusCode(403);
  }
}
