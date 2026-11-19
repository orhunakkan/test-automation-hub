package com.testautomationhub.selenium.pages;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LibraryPage {

  private static final By HEADING = By.cssSelector("[data-testid=library-title]");
  private static final By ACCOUNT_MENU = By.cssSelector("[data-testid=account-menu]");
  private static final By SIGN_OUT = By.cssSelector("[data-testid=account-sign-out]");
  private static final By SIGN_IN_LINK = By.cssSelector("[data-testid=sign-in-link]");

  private final WebDriver driver;

  public LibraryPage(WebDriver driver) {
    this.driver = driver;
  }

  public WebElement heading() {
    return driver.findElement(HEADING);
  }

  public WebElement accountMenu() {
    return displayed(ACCOUNT_MENU);
  }

  public WebElement signOutButton() {
    return displayed(SIGN_OUT);
  }

  public WebElement signInLink() {
    return displayed(SIGN_IN_LINK);
  }

  public void signOut() {
    accountMenu().click();
    WebElement signOutButton = signOutButton();
    signOutButton.click();
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.stalenessOf(signOutButton));
  }

  private WebElement displayed(By locator) {
    return driver.findElements(locator).stream()
        .filter(WebElement::isDisplayed)
        .findFirst()
        .orElseThrow();
  }
}
