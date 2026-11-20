Feature: Demo trading login (mock target)
  As a QA engineer showcasing BDD
  I want to describe login in Gherkin
  So stakeholders can read the smoke flow

  @smoke @bdd
  Scenario: Successful login reaches the dashboard
    Given I open the demo login page
    When I sign in with demo credentials
    Then the trading dashboard is visible