package com.testautomationhub.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class BookPage {

  private static final By TITLE = By.cssSelector("[data-testid=book-title]");
  private static final By START_READING = By.cssSelector("[data-testid=book-start-reading]");

  private final WebDriver driver;

  public BookPage(WebDriver driver) {
    this.driver = driver;
  }

  public WebElement title() {
    return driver.findElement(TITLE);
  }

  public WebElement startReading() {
    return driver.findElement(START_READING);
  }
}
