package com.testautomationhub.selenium.tests.api;

import static io.restassured.RestAssured.given;

import com.testautomationhub.selenium.support.Config;
import java.net.URI;
import org.junit.jupiter.api.Test;

class LoginTest {

  @Test
  void signInWithoutAnOriginHeaderIsRefused() {
    given().baseUri(Config.get("baseUrl")).when().post("/login").then().statusCode(403);
  }

  @Test
  void memberSignsIn() {
    URI base = URI.create(Config.get("baseUrl"));
    given()
        .baseUri(base.toString())
        .redirects()
        .follow(false)
        .header("Origin", base.getScheme() + "://" + base.getAuthority())
        .formParam("username", Config.get("memberUsername"))
        .formParam("password", Config.get("memberPassword"))
        .when()
        .post("/login")
        .then()
        .statusCode(303)
        .header("location", "/library")
        .cookie("__Host-session");
  }

  @Test
  void adminSignsIn() {
    URI base = URI.create(Config.get("baseUrl"));
    given()
        .baseUri(base.toString())
        .redirects()
        .follow(false)
        .header("Origin", base.getScheme() + "://" + base.getAuthority())
        .formParam("username", Config.get("adminUsername"))
        .formParam("password", Config.get("adminPassword"))
        .when()
        .post("/login")
        .then()
        .statusCode(303)
        .header("location", "/library")
        .cookie("__Host-session");
  }
}
