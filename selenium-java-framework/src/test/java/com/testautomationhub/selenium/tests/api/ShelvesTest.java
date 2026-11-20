package com.testautomationhub.selenium.tests.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.testautomationhub.selenium.support.AccessToken;
import com.testautomationhub.selenium.support.Config;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import java.net.URI;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

class ShelvesTest {

  private static final URI BASE = URI.create(Config.get("baseUrl"));
  private static final String ORIGIN = BASE.getScheme() + "://" + BASE.getAuthority();

  private String session;
  private String token;
  private String shelfId;

  @AfterEach
  void cleanUp() {
    if (shelfId != null) {
      (token != null ? withToken() : signedIn())
          .body("{\"intent\":\"delete\"}")
          .post("/account/shelves/" + shelfId);
    }
    if (token != null) {
      AccessToken.revoke(token);
    }
  }

  @Test
  void creatingAShelfSignedOutIsRefused() {
    given()
        .baseUri(BASE.toString())
        .header("Origin", ORIGIN)
        .contentType(ContentType.JSON)
        .body("{\"name\":\"api-test-" + System.currentTimeMillis() + "\"}")
        .when()
        .post("/account/shelves/new")
        .then()
        .statusCode(401)
        .body("error", equalTo("signed_out"));
  }

  @Test
  void shelfLifecycle() {
    session =
        given()
            .baseUri(BASE.toString())
            .redirects()
            .follow(false)
            .header("Origin", ORIGIN)
            .formParam("username", Config.get("memberUsername"))
            .formParam("password", Config.get("memberPassword"))
            .when()
            .post("/login")
            .then()
            .statusCode(303)
            .extract()
            .cookie("__Host-session");
    String name = "api-test-" + System.currentTimeMillis();

    shelfId =
        signedIn()
            .body("{\"name\":\"" + name + "\"}")
            .when()
            .post("/account/shelves/new")
            .then()
            .statusCode(201)
            .body("shelf.name", equalTo(name))
            .extract()
            .path("shelf.id");

    signedIn()
        .body("{\"name\":\"" + name + "-renamed\"}")
        .when()
        .post("/account/shelves/" + shelfId)
        .then()
        .statusCode(200)
        .body("shelf.name", equalTo(name + "-renamed"));

    signedIn()
        .body("{\"intent\":\"delete\"}")
        .when()
        .post("/account/shelves/" + shelfId)
        .then()
        .statusCode(200)
        .body("deleted", equalTo(true));
    shelfId = null;
  }

  @Test
  void shelfLifecycleWithAToken() {
    token = AccessToken.create("member");
    String name = "api-test-" + System.currentTimeMillis();

    shelfId =
        withToken()
            .body("{\"name\":\"" + name + "\"}")
            .when()
            .post("/account/shelves/new")
            .then()
            .statusCode(201)
            .body("shelf.name", equalTo(name))
            .extract()
            .path("shelf.id");

    withToken()
        .body("{\"name\":\"" + name + "-renamed\"}")
        .when()
        .post("/account/shelves/" + shelfId)
        .then()
        .statusCode(200)
        .body("shelf.name", equalTo(name + "-renamed"));

    withToken()
        .body("{\"intent\":\"delete\"}")
        .when()
        .post("/account/shelves/" + shelfId)
        .then()
        .statusCode(200)
        .body("deleted", equalTo(true));
    shelfId = null;
  }

  private RequestSpecification withToken() {
    return given().baseUri(BASE.toString()).auth().oauth2(token).contentType(ContentType.JSON);
  }

  private RequestSpecification signedIn() {
    return given()
        .baseUri(BASE.toString())
        .header("Origin", ORIGIN)
        .cookie("__Host-session", session)
        .contentType(ContentType.JSON);
  }
}
