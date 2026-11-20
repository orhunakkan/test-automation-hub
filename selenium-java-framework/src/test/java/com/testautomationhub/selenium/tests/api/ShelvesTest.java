package com.testautomationhub.selenium.tests.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.testautomationhub.selenium.support.Config;
import io.restassured.http.ContentType;
import java.net.URI;
import org.junit.jupiter.api.Test;

class ShelvesTest {

  @Test
  void creatingAShelfSignedOutIsRefused() {
    URI base = URI.create(Config.get("baseUrl"));
    given()
        .baseUri(base.toString())
        .header("Origin", base.getScheme() + "://" + base.getAuthority())
        .contentType(ContentType.JSON)
        .body("{\"name\":\"api-test-" + System.currentTimeMillis() + "\"}")
        .when()
        .post("/account/shelves/new")
        .then()
        .statusCode(401)
        .body("error", equalTo("signed_out"));
  }
}
