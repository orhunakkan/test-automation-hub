package com.testautomationhub.selenium.pages;

import com.testautomationhub.selenium.support.Config;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ReaderPage {

  private static final By PAGE_LABEL = By.cssSelector("[data-testid=reader-page-label]");
  private static final By NEXT_PAGE = By.cssSelector("[data-testid=reader-next-page]");
  private static final By CONTENTS = By.cssSelector("[data-testid=reader-contents]");
  private static final By CONTENTS_DRAWER = By.cssSelector("[data-testid=contents-drawer]");
  private static final By CONTENTS_CLOSE = By.cssSelector("[data-testid=contents-close]");
  private static final String HYDRATED = "return document.documentElement.dataset.hydrated";

  private final WebDriver driver;

  public ReaderPage(WebDriver driver) {
    this.driver = driver;
  }

  public void open(String path) {
    driver.get(Config.get("baseUrl") + path);
    JavascriptExecutor js = (JavascriptExecutor) driver;
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> "true".equals(js.executeScript(HYDRATED)));
  }

  public WebElement pageLabel() {
    return driver.findElement(PAGE_LABEL);
  }

  public WebElement nextPage() {
    return driver.findElement(NEXT_PAGE);
  }

  public WebElement contentsButton() {
    return driver.findElement(CONTENTS);
  }

  public WebElement contentsDrawer() {
    return driver.findElement(CONTENTS_DRAWER);
  }

  public WebElement contentsClose() {
    return driver.findElement(CONTENTS_CLOSE);
  }

  public void openContents() {
    contentsButton().click();
  }
}
