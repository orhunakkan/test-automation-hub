package com.testautomationhub.selenium.support;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;

public abstract class BrowserTest {

  protected WebDriver driver;

  @BeforeEach
  protected void startDriver() {
    driver = DriverFactory.create();
  }

  @AfterEach
  protected void quitDriver() {
    if (driver != null) driver.quit();
  }
}
