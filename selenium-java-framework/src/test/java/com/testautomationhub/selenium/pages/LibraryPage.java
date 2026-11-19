package com.testautomationhub.selenium.pages;

import com.testautomationhub.selenium.support.Config;
import java.time.Duration;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LibraryPage {

  private static final By HEADING = By.cssSelector("[data-testid=library-title]");
  private static final By SEARCH = By.cssSelector("[data-testid=library-search]");
  private static final By COUNT = By.cssSelector("[data-testid=library-count]");
  private static final By BOOK_CARD = By.cssSelector("[data-testid=book-card]");
  private static final String HYDRATED = "return document.documentElement.dataset.hydrated";
  private static final By ACCOUNT_MENU = By.cssSelector("[data-testid=account-menu]");
  private static final By SIGN_OUT = By.cssSelector("[data-testid=account-sign-out]");
  private static final By SIGN_IN_LINK = By.cssSelector("[data-testid=sign-in-link]");

  private final WebDriver driver;

  public LibraryPage(WebDriver driver) {
    this.driver = driver;
  }

  public void open() {
    driver.get(Config.get("baseUrl") + "/library");
    JavascriptExecutor js = (JavascriptExecutor) driver;
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> "true".equals(js.executeScript(HYDRATED)));
  }

  public WebElement searchBox() {
    return driver.findElement(SEARCH);
  }

  public void search(String query) {
    searchBox().sendKeys(query);
  }

  public WebElement count() {
    return driver.findElement(COUNT);
  }

  public List<WebElement> books() {
    return driver.findElements(BOOK_CARD);
  }

  public WebElement heading() {
    return driver.findElement(HEADING);
  }

  public WebElement book(String slug) {
    return driver.findElement(By.cssSelector("[data-testid=book-card][data-key=" + slug + "]"));
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
