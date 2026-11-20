package com.testautomationhub.selenium.support;

import static java.util.stream.Collectors.joining;

import com.deque.html.axecore.results.Results;
import com.deque.html.axecore.results.Rule;
import com.deque.html.axecore.selenium.AxeBuilder;
import java.time.Duration;
import java.util.List;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public final class Accessibility {

  private static final List<String> TAGS = List.of("wcag2a", "wcag2aa", "wcag21a", "wcag21aa");
  private static final String SETTLED =
      "return document.documentElement.dataset.hydrated === 'true'"
          + " && document.getAnimations().every((animation) => animation.playState !== 'running'"
          + " || !animation.effect?.getKeyframes().some((frame) => 'opacity' in frame || 'transform' in frame))";

  private Accessibility() {}

  public static List<String> violations(WebDriver driver) {
    JavascriptExecutor js = (JavascriptExecutor) driver;
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> Boolean.TRUE.equals(js.executeScript(SETTLED)));
    Results results = new AxeBuilder().withTags(TAGS).analyze(driver);
    if (results.isErrored()) {
      throw new IllegalStateException("axe scan failed: " + results.getErrorMessage());
    }
    return results.getViolations().stream().map(Accessibility::line).toList();
  }

  private static String line(Rule violation) {
    String targets =
        violation.getNodes().stream()
            .limit(5)
            .map(node -> target(node.getTarget()))
            .collect(joining(", "));
    return violation.getId()
        + " ("
        + violation.getImpact()
        + "): "
        + violation.getHelp()
        + " at "
        + targets;
  }

  private static String target(Object target) {
    return target instanceof List<?> parts
        ? parts.stream().map(String::valueOf).collect(joining(" "))
        : String.valueOf(target);
  }
}
