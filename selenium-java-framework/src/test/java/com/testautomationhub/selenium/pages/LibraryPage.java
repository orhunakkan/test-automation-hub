package com.testautomationhub.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class LibraryPage {

  private static final By HEADING = By.tagName("h1");

  private final WebDriver driver;

  public LibraryPage(WebDriver driver) {
    this.driver = driver;
  }

  public WebElement heading() {
    return driver.findElement(HEADING);
  }
}
