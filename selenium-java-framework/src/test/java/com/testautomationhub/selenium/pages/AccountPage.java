package com.testautomationhub.selenium.pages;

import com.testautomationhub.selenium.support.Config;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AccountPage {

  private static final By TITLE = By.cssSelector("[data-testid=account-title]");
  private static final String HYDRATED = "return document.documentElement.dataset.hydrated";

  private final WebDriver driver;

  public AccountPage(WebDriver driver) {
    this.driver = driver;
  }

  public void open() {
    driver.get(Config.get("baseUrl") + "/account");
    JavascriptExecutor js = (JavascriptExecutor) driver;
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> "true".equals(js.executeScript(HYDRATED)));
  }

  public WebElement title() {
    return driver.findElement(TITLE);
  }
}
