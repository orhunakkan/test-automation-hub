package com.testautomationhub.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class SignInPage {

  private static final By USERNAME = By.cssSelector("[data-testid=username]");
  private static final By PASSWORD = By.cssSelector("[data-testid=password]");
  private static final By SUBMIT = By.cssSelector("[data-testid=sign-in]");

  private final WebDriver driver;

  public SignInPage(WebDriver driver) {
    this.driver = driver;
  }

  public void signIn(String username, String password) {
    driver.findElement(USERNAME).sendKeys(username);
    driver.findElement(PASSWORD).sendKeys(password);
    driver.findElement(SUBMIT).click();
  }
}
