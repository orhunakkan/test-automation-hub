package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.LibraryPage;
import com.testautomationhub.selenium.support.Config;
import com.testautomationhub.selenium.support.DriverFactory;
import com.testautomationhub.selenium.support.SignIn;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;

class SignOutTest {

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
  @DisplayName("member signs out")
  void memberSignsOut() {
    LibraryPage libraryPage = new LibraryPage(driver);
    SignIn.as(driver, "member");
    driver.get(Config.get("baseUrl") + "/library");
    libraryPage.signOut();
    assertThat(libraryPage.signInLink().isDisplayed()).isTrue();
  }

  @Test
  @DisplayName("admin signs out")
  void adminSignsOut() {
    LibraryPage libraryPage = new LibraryPage(driver);
    SignIn.as(driver, "admin");
    driver.get(Config.get("baseUrl") + "/library");
    libraryPage.signOut();
    assertThat(libraryPage.signInLink().isDisplayed()).isTrue();
  }
}
