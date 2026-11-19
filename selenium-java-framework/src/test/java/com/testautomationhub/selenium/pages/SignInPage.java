package com.testautomationhub.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class SignInPage {

  private static final By USERNAME = By.cssSelector("[data-testid=username]");
  private static final By PASSWORD = By.cssSelector("[data-testid=password]");
  private static final By SUBMIT = By.cssSelector("[data-testid=sign-in]");
  private static final By ERROR = By.cssSelector("[data-testid=sign-in-error]");

  private final WebDriver driver;

  public SignInPage(WebDriver driver) {
    this.driver = driver;
  }

  public void signIn(String username, String password) {
    driver.findElement(USERNAME).sendKeys(username);
    driver.findElement(PASSWORD).sendKeys(password);
    driver.findElement(SUBMIT).click();
  }

  public WebElement error() {
    return driver.findElement(ERROR);
  }
}
