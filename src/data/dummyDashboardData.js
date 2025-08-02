// Dummy dashboard data for automation maturity assessment visualizations
const dummyDashboardData = {
  "assessments": [
    {
      "id": "proj_A_2024_Q1",
      "projectName": "Project Alpha",
      "account": "TechCorp",
      "manager": "Alice Wonderland",
      "edl": "Bob The Builder",
      "timestamp": "2024-03-31T10:00:00Z",
      "formattedResponses": [
        {
          "Parameter": "Automation coverage",
          "ParameterWeightage": 11,
          "responses": [
            { "question": "What percentage of Regression test cases have been automated?", "qWeightage": 3, "selectedOption": "a", "level": 4, "value": 80 },
            { "question": "What percentage of End-to-End test cases have been automated?", "qWeightage": 2, "selectedOption": "a", "level": 4, "value": 75 },
            { "question": "What percentage of device automation test cases have been automated?", "qWeightage": 1, "selectedOption": "a", "level": 4, "value": 60 },
            { "question": "Select the level of functional test cases automated?", "qWeightage": 4, "selectedOption": "b", "level": 2, "value": 50 }
          ]
        },
        {
          "Parameter": "Automated NFT",
          "ParameterWeightage": 9,
          "responses": [
            { "question": "How much percentage of your Performance Testing automated?", "qWeightage": 6, "selectedOption": "a", "level": 4, "value": 90 },
            { "question": "How much percentage of your Accessibility Testing automated?", "qWeightage": 2, "selectedOption": "c", "level": 2, "value": 40 },
            { "question": "How much percentage of your Security Testing automated?", "qWeightage": 5, "selectedOption": "d", "level": 1, "value": 20 },
            { "question": "How much percentage of your Compatibility Testing (Browsers) automated?", "qWeightage": 4, "selectedOption": "d", "level": 1, "value": 30 },
            { "question": "How much percentage of your Compatibility Testing (Devices) automated?", "qWeightage": 3, "selectedOption": "d", "level": 1, "value": 25 },
            { "question": "How much percentage of your Usability Testing automated?", "qWeightage": 1, "selectedOption": "c", "level": 2, "value": 50 }
          ]
        },
        {
          "Parameter": "CI/CD Integration",
          "ParameterWeightage": 8,
          "responses": [
            { "question": "Is CI/CD integrated for automation?", "qWeightage": 5, "selectedOption": "a", "level": 4, "value": 100 },
            { "question": "Frequency of automation runs?", "qWeightage": 3, "selectedOption": "b", "level": 3, "value": 75 }
          ]
        }
      ]
    },
    {
      "id": "proj_A_2024_Q2",
      "projectName": "Project Alpha",
      "account": "TechCorp",
      "manager": "Alice Wonderland",
      "edl": "Bob The Builder",
      "timestamp": "2024-06-30T10:00:00Z",
      "formattedResponses": [
        {
          "Parameter": "Automation coverage",
          "ParameterWeightage": 11,
          "responses": [
            { "question": "What percentage of Regression test cases have been automated?", "qWeightage": 3, "selectedOption": "a", "level": 4, "value": 85 },
            { "question": "What percentage of End-to-End test cases have been automated?", "qWeightage": 2, "selectedOption": "a", "level": 4, "value": 80 },
            { "question": "What percentage of device automation test cases have been automated?", "qWeightage": 1, "selectedOption": "a", "level": 4, "value": 65 },
            { "question": "Select the level of functional test cases automated?", "qWeightage": 4, "selectedOption": "b", "level": 3, "value": 60 }
          ]
        },
        {
          "Parameter": "Automated NFT",
          "ParameterWeightage": 9,
          "responses": [
            { "question": "How much percentage of your Performance Testing automated?", "qWeightage": 6, "selectedOption": "a", "level": 4, "value": 95 },
            { "question": "How much percentage of your Accessibility Testing automated?", "qWeightage": 2, "selectedOption": "c", "level": 3, "value": 50 },
            { "question": "How much percentage of your Security Testing automated?", "qWeightage": 5, "selectedOption": "d", "level": 2, "value": 30 },
            { "question": "How much percentage of your Compatibility Testing (Browsers) automated?", "qWeightage": 4, "selectedOption": "d", "level": 2, "value": 40 },
            { "question": "How much percentage of your Compatibility Testing (Devices) automated?", "qWeightage": 3, "selectedOption": "d", "level": 2, "value": 35 },
            { "question": "How much percentage of your Usability Testing automated?", "qWeightage": 1, "selectedOption": "c", "level": 3, "value": 60 }
          ]
        },
        {
          "Parameter": "CI/CD Integration",
          "ParameterWeightage": 8,
          "responses": [
            { "question": "Is CI/CD integrated for automation?", "qWeightage": 5, "selectedOption": "a", "level": 4, "value": 100 },
            { "question": "Frequency of automation runs?", "qWeightage": 3, "selectedOption": "b", "level": 4, "value": 85 }
          ]
        }
      ]
    },
    {
      "id": "proj_B_2024_Q1",
      "projectName": "Project Beta",
      "account": "GlobalSolutions",
      "manager": "Charlie Chaplin",
      "edl": "David Bowie",
      "timestamp": "2024-03-31T10:00:00Z",
      "formattedResponses": [
        {
          "Parameter": "Automation coverage",
          "ParameterWeightage": 11,
          "responses": [
            { "question": "What percentage of Regression test cases have been automated?", "qWeightage": 3, "selectedOption": "a", "level": 3, "value": 70 },
            { "question": "What percentage of End-to-End test cases have been automated?", "qWeightage": 2, "selectedOption": "a", "level": 3, "value": 65 },
            { "question": "What percentage of device automation test cases have been automated?", "qWeightage": 1, "selectedOption": "a", "level": 3, "value": 50 },
            { "question": "Select the level of functional test cases automated?", "qWeightage": 4, "selectedOption": "b", "level": 2, "value": 40 }
          ]
        },
        {
          "Parameter": "Automated NFT",
          "ParameterWeightage": 9,
          "responses": [
            { "question": "How much percentage of your Performance Testing automated?", "qWeightage": 6, "selectedOption": "a", "level": 3, "value": 75 },
            { "question": "How much percentage of your Accessibility Testing automated?", "qWeightage": 2, "selectedOption": "c", "level": 2, "value": 30 },
            { "question": "How much percentage of your Security Testing automated?", "qWeightage": 5, "selectedOption": "d", "level": 1, "value": 15 },
            { "question": "How much percentage of your Compatibility Testing (Browsers) automated?", "qWeightage": 4, "selectedOption": "d", "level": 1, "value": 20 },
            { "question": "How much percentage of your Compatibility Testing (Devices) automated?", "qWeightage": 3, "selectedOption": "d", "level": 1, "value": 18 },
            { "question": "How much percentage of your Usability Testing automated?", "qWeightage": 1, "selectedOption": "c", "level": 2, "value": 45 }
          ]
        },
        {
          "Parameter": "CI/CD Integration",
          "ParameterWeightage": 8,
          "responses": [
            { "question": "Is CI/CD integrated for automation?", "qWeightage": 5, "selectedOption": "a", "level": 3, "value": 80 },
            { "question": "Frequency of automation runs?", "qWeightage": 3, "selectedOption": "b", "level": 2, "value": 60 }
          ]
        }
      ]
    },
    {
      "id": "proj_B_2024_Q2",
      "projectName": "Project Beta",
      "account": "GlobalSolutions",
      "manager": "Charlie Chaplin",
      "edl": "David Bowie",
      "timestamp": "2024-06-30T10:00:00Z",
      "formattedResponses": [
        {
          "Parameter": "Automation coverage",
          "ParameterWeightage": 11,
          "responses": [
            { "question": "What percentage of Regression test cases have been automated?", "qWeightage": 3, "selectedOption": "a", "level": 4, "value": 80 },
            { "question": "What percentage of End-to-End test cases have been automated?", "qWeightage": 2, "selectedOption": "a", "level": 3, "value": 70 },
            { "question": "What percentage of device automation test cases have been automated?", "qWeightage": 1, "selectedOption": "a", "level": 4, "value": 65 },
            { "question": "Select the level of functional test cases automated?", "qWeightage": 4, "selectedOption": "b", "level": 3, "value": 55 }
          ]
        },
        {
          "Parameter": "Automated NFT",
          "ParameterWeightage": 9,
          "responses": [
            { "question": "How much percentage of your Performance Testing automated?", "qWeightage": 6, "selectedOption": "a", "level": 4, "value": 85 },
            { "question": "How much percentage of your Accessibility Testing automated?", "qWeightage": 2, "selectedOption": "c", "level": 2, "value": 45 },
            { "question": "How much percentage of your Security Testing automated?", "qWeightage": 5, "selectedOption": "d", "level": 2, "value": 25 },
            { "question": "How much percentage of your Compatibility Testing (Browsers) automated?", "qWeightage": 4, "selectedOption": "d", "level": 2, "value": 35 },
            { "question": "How much percentage of your Compatibility Testing (Devices) automated?", "qWeightage": 3, "selectedOption": "d", "level": 2, "value": 30 },
            { "question": "How much percentage of your Usability Testing automated?", "qWeightage": 1, "selectedOption": "c", "level": 3, "value": 55 }
          ]
        },
        {
          "Parameter": "CI/CD Integration",
          "ParameterWeightage": 8,
          "responses": [
            { "question": "Is CI/CD integrated for automation?", "qWeightage": 5, "selectedOption": "a", "level": 4, "value": 90 },
            { "question": "Frequency of automation runs?", "qWeightage": 3, "selectedOption": "b", "level": 3, "value": 70 }
          ]
        }
      ]
    }
  ],
  "filters": {
    "edlOptions": ["Bob The Builder", "David Bowie", "Eve Adams"],
    "managerOptions": ["Alice Wonderland", "Charlie Chaplin", "Frank Sinatra"],
    "accountOptions": ["TechCorp", "GlobalSolutions", "InnovateX"],
    "projectOptions": ["Project Alpha", "Project Beta", "Project Gamma"]
  }
};

export default dummyDashboardData;
