package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.LibraryPage;
import com.testautomationhub.selenium.support.Config;
import com.testautomationhub.selenium.support.DriverFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;

class LibraryTest {

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
  @DisplayName("library loads")
  void libraryLoads() {
    LibraryPage libraryPage = new LibraryPage(driver);
    driver.get(Config.get("baseUrl") + "/library");
    assertThat(libraryPage.heading().getText()).isEqualTo("Library");
  }
}
