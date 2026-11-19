package com.testautomationhub.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class LibraryPage {

  private static final By HEADING = By.cssSelector("[data-testid=library-title]");
  private static final By ACCOUNT_MENU = By.cssSelector("[data-testid=account-menu]");

  private final WebDriver driver;

  public LibraryPage(WebDriver driver) {
    this.driver = driver;
  }

  public WebElement heading() {
    return driver.findElement(HEADING);
  }

  // The account menu renders twice, in the sidebar and in the phone-width top bar; only one shows.
  public WebElement accountMenu() {
    return driver.findElements(ACCOUNT_MENU).stream()
        .filter(WebElement::isDisplayed)
        .findFirst()
        .orElseThrow();
  }
}
