@skip-session-reload
Feature: Login as a user with access to multiple districts
    As a MO Supervisor that has access to multiple districts
    I want to login to the Lantern dashboard
    And see data related to the districts I can access

    Background:
        Given I am a user that has 2 district restrictions
        And I am on the Lantern Dashboard
    
    Scenario: Viewing the District Filter
        Then I should see "2 Items" selected in the filter
    
    Scenario: Selecting a different district in the filter
        When I select district "13" from the District Filter
        Then I should see "TCSTL" selected in the filter
        When I select district "TCSTL" from the District Filter
        And I select district "13" from the District Filter
        Then I should see "13" selected in the filter

    Scenario: Viewing the District Chart
        When I am viewing the District chart
        Then I should see district "13,TCSTL" highlighted on the chart
    
    Scenario: Viewing the Case Table
        When I am viewing the Case Table
        Then I should only see cases from district "13,TCSTL"
