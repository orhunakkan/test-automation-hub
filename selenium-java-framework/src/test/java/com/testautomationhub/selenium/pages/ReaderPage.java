package com.testautomationhub.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class ReaderPage {

  private static final By PAGE_LABEL = By.cssSelector("[data-testid=reader-page-label]");
  private static final By NEXT_PAGE = By.cssSelector("[data-testid=reader-next-page]");

  private final WebDriver driver;

  public ReaderPage(WebDriver driver) {
    this.driver = driver;
  }

  public WebElement pageLabel() {
    return driver.findElement(PAGE_LABEL);
  }

  public WebElement nextPage() {
    return driver.findElement(NEXT_PAGE);
  }
}
