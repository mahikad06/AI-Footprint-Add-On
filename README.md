# AI Footprint Add On 

## Overview
A Chrome Extension to track your carbon footprint real-time from your AI usage. AI Footprint tracks your time spent on major AI platforms (ChatGPT, Claude, and Gemini) and uses it to calculate estimated CO2 emisions based on this formula: 

```Carbon Emissions (kg CO2) = Compute Hours x Power Draw (kW) x Power Usage Effectiveness x Grid Carbon Intensity (kg CO2/kWh)```

The extension displays a live stopwatch and emissions value within a simple popup UI with three pages: Main, Dashboard, and Settings. 
<img width="1920" height="660" alt="popupTriScreen" src="https://github.com/user-attachments/assets/7aded790-9ecd-452b-81c9-141d1359c7a0" />


## Install 
The extension is not available on the Chrome Web Store yet but can be downloaded here: 

https://github.com/mahikad06/AI-Footprint-Add-On/releases/tag/v0.1.0

## Permissions

Active tab: when extension is interacted with, it can temporarily access the user's currently active tab in order to fulfill its primarily functions

Tabs: grants the extension access to information like tab URLs, which is what the extension uses to check if the user is on an AI website 

Storage: enables the user to store their own personal data gathered by the extension in their computer and save history and settings
