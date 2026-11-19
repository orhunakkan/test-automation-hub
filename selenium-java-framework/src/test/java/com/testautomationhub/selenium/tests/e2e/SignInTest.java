package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.LibraryPage;
import com.testautomationhub.selenium.pages.SignInPage;
import com.testautomationhub.selenium.support.Config;
import com.testautomationhub.selenium.support.DriverFactory;
import java.time.Duration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

class SignInTest {

  private WebDriver driver;

  @BeforeEach
  void startDriver() {
    driver = DriverFactory.create();
  }

  @AfterEach
  void quitDriver() {
    if (driver != null) driver.quit();
  }

  @Test
  @DisplayName("member signs in")
  void memberSignsIn() {
    SignInPage signInPage = new SignInPage(driver);
    LibraryPage libraryPage = new LibraryPage(driver);
    driver.get(Config.get("baseUrl") + "/login");
    signInPage.signIn(Config.get("memberUsername"), Config.get("memberPassword"));
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.urlToBe(Config.get("baseUrl") + "/library"));
    assertThat(libraryPage.accountMenu().isDisplayed()).isTrue();
  }

  @Test
  @DisplayName("admin signs in")
  void adminSignsIn() {
    SignInPage signInPage = new SignInPage(driver);
    LibraryPage libraryPage = new LibraryPage(driver);
    driver.get(Config.get("baseUrl") + "/login");
    signInPage.signIn(Config.get("adminUsername"), Config.get("adminPassword"));
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.urlToBe(Config.get("baseUrl") + "/library"));
    assertThat(libraryPage.accountMenu().isDisplayed()).isTrue();
  }
}
