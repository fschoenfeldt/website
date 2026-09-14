---
layout: layouts/a4doc.njk
title: laufmaus Privacy Policy
skipHeader: true
eleventyExcludeFromCollections: true
---

## Privacy Policy

This privacy policy applies to the laufmaus app for mobile devices, together with any related services operated by Frederik Schönfeldt (collectively, the "Application"). Frederik Schönfeldt is hereby referred to as the "Service Provider".

### What information does the Application obtain and how is it used?

The Application does not collect, log, or store any personal information when you download and use it, with the exception of health and fitness data processed locally on your device as described in the section ["Health Data"](#health-data) below. Registration is not required. If the Application is used with an active internet connection, technical protocol data (such as your ephemeral IP address) is transmitted to facilitate network connectivity, but this data is not retained or used for tracking.

### <span id="health-data">Health Data</span>

The Application controls treadmills over Bluetooth and saves each workout to Health Connect (Android) or Apple Health (iOS), including estimated calories and step count. With your permission, it reads a few body measurements for these estimates and writes the workout; heart rate from a connected monitor is written in short batches while the workout runs, so a crash does not lose it. Every permission is optional, and the Application requests nothing beyond the tables below.

All health data is processed on your device only. Body measurements are read when a calculation needs them, kept in memory while the Application is open, and never stored or transmitted. The only health data the Application stores itself is a small record of the workout in progress (elapsed time, distance, steps, heart rate sum and count), so an interrupted workout can be recovered; it is excluded from device backups and removed once the workout is saved or discarded. The Service Provider runs no servers that receive health data, and health data is never shared or used for advertising or analytics.

#### <span id="health-connect">Health Connect (Android)</span>

| Data type              | Access | Purpose                                                                | Details                               |
| ---------------------- | ------ | ---------------------------------------------------------------------- | ------------------------------------- |
| Weight                 | Read   | Estimate calories. Without it, no calorie estimate.                    | [Calorie estimate](#calorie-estimate) |
| Height                 | Read   | Stride length for the step count. Without it, a generic stride length. | [Step count](#step-count)             |
| Exercise session       | Write  | The completed workout.                                                 |                                       |
| Distance               | Write  | Distance walked.                                                       |                                       |
| Steps                  | Write  | Step count.                                                            | [Step count](#step-count)             |
| Active calories burned | Write  | Calorie estimate.                                                      | [Calorie estimate](#calorie-estimate) |
| Heart rate             | Write  | Readings from a connected heart rate monitor.                          |                                       |

The Application's use of information received from Health Connect adheres to the [Health Connect Permissions policy](https://support.google.com/googleplay/android-developer/answer/16558241#ahp), including the Limited Use requirements.

#### <span id="apple-health">Apple Health (iOS)</span>

| Data type                  | Access | Purpose                                                                                               | Details                                                          |
| -------------------------- | ------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Weight                     | Read   | Estimate calories. Without it, no calorie estimate.                                                   | [Calorie estimate](#calorie-estimate)                            |
| Height                     | Read   | Stride length for the step count. Without it, a generic stride length.                                | [Step count](#step-count)                                        |
| Date of birth              | Read   | Heart-rate-based calorie estimate. Without it, calories come from speed and weight.                   | [Calorie estimate](#calorie-estimate)                            |
| Biological sex             | Read   | Heart-rate-based calorie estimate and stride length. Without it, calories come from speed and weight. | [Calorie estimate](#calorie-estimate), [Step count](#step-count) |
| VO₂max                     | Read   | More accurate heart-rate-based calorie estimate. Without it, VO₂max is estimated from age and sex.    | [Calorie estimate](#calorie-estimate)                            |
| Workouts                   | Write  | The completed workout.                                                                                |                                                                  |
| Walking + running distance | Write  | Distance walked.                                                                                      |                                                                  |
| Steps                      | Write  | Step count.                                                                                           | [Step count](#step-count)                                        |
| Active energy              | Write  | Calorie estimate.                                                                                     | [Calorie estimate](#calorie-estimate)                            |
| Heart rate                 | Write  | Readings from a connected heart rate monitor.                                                         |                                                                  |

#### <span id="calorie-estimate">Calorie estimate</span>

**Speed-based** (Android and iOS, needs body weight), with MET from 2.5 below 4 km/h up to 11 above 10 km/h:

> kcal = MET × 3.5 × weight in kg × minutes / 200

**Heart-rate-based** (iOS only, Keytel et al. 2005), for the minutes with heart rate readings when weight, date of birth and biological sex are known; the result is converted to kcal (÷ 4.184):

> men: kJ/min = −95.7735 + 0.634 × heart rate + 0.404 × VO₂max + 0.394 × weight in kg + 0.271 × age
>
> women: kJ/min = −59.3954 + 0.45 × heart rate + 0.38 × VO₂max + 0.103 × weight in kg + 0.274 × age

Without a VO₂max measurement, it is estimated from age and sex. Minutes without heart rate use the speed-based method. Health Connect has no date of birth or biological sex, so Android always uses the speed-based method.

#### <span id="step-count">Step count</span>

The treadmill's own step count is saved. It is replaced by an estimate when the treadmill reports none, or when it reports more than 1.5 times the estimate after at least 100 m (some treadmills count every step twice):

> steps = distance in m ÷ stride length in m

The stride length follows from height and the average speed _v_ in m/s, with _k_ = 0.415 for men, 0.413 for women and 0.414 if biological sex is unknown:

> walking stride = k × height in m + 0.1 × (v − 1.4)
>
> running stride = 1.25 × k × height in m + 0.25 × (v − 2.5)

Between 1.9 and 2.5 m/s (about 6.8 to 9 km/h) the two are blended linearly; above that, the running stride applies. Without height, a generic stride length is used:

> walking stride = 0.7 + 0.1 × (v − 1.4)
>
> running stride = 1.1 + 0.25 × (v − 2.5)

### Does the Application collect precise real time location information of the device?

This Application does not collect precise information about the location of your mobile device.

### Do third parties see and/or have access to information obtained by the Application?

The Application does not share any data, including health and fitness data, with third parties.

### Data Retention and Deletion

The Application retains no user data itself beyond the record of a workout in progress described above. The values listed above — weight, height, and on iOS also date of birth, biological sex and VO₂max — are read from Health Connect / Apple Health at the time of calculation and discarded afterwards; workout results exist only as records in Health Connect / Apple Health on your device, which remain under your control. If you discard a recovered workout, its record on your device is deleted; heart rate readings already written to Health Connect / Apple Health stay there, because they are measurements you can review and delete yourself at any time. The Service Provider does not store or retain any user data on external servers, so there is no server-side data to delete.

You can delete your data at any time by:

- deleting individual workout records directly in Health Connect or the Apple Health app,
- revoking the Application's permissions in Health Connect / Apple Health, or
- uninstalling the Application.

For any personal data you may have provided directly (for example, by contacting the Service Provider by email), you may request deletion by emailing apps@fschoenfeldt.de.

### What are my opt-out rights?

You can revoke the Application's access to health data at any time in the Health Connect or Apple Health settings without uninstalling the Application. Uninstalling the Application removes it and all of its data from your device.

If you contact the Service Provider directly or voluntarily provide information by other means, you may request deletion of that information by contacting apps@fschoenfeldt.de.

### Children

The Application is not intended for children under 16 years of age, or such higher age as required by applicable law. The Service Provider does not knowingly solicit data from children or market to them. If you voluntarily provide personal information and are under 16 years of age, your parent or guardian must provide consent on your behalf where permitted by law.

### Security

Health and fitness data processed by the Application never leaves your device and is protected by the operating system's app sandbox and the Health Connect / Apple Health permission system. The record of a workout in progress is held in the Application's private storage, protected by the operating system's on-device encryption, and excluded from device backups. Because the Service Provider does not operate servers that hold user data, the risk of server-side data exposure does not arise. However, no security system is completely secure; the Service Provider implements reasonable safeguards to protect its systems.

### Data Breach Notification

Since the Application processes health data locally on your device only and the Service Provider does not store user data on servers, the risk of a data breach affecting your personal data is minimal. If a breach occurs involving any data you have voluntarily provided, the Service Provider will notify you as required by applicable law.

### Changes

The Service Provider may update this Privacy Policy from time to time. The Service Provider will notify you of material changes by posting the updated Privacy Policy with an effective date. Where required by law, the Service Provider will seek your consent to material changes before they take effect.

Previous versions of this Privacy Policy will be maintained and made available upon request by contacting the Service Provider at apps@fschoenfeldt.de.

This privacy policy is effective as of 2026-09-14

### Your Consent

The Application only accesses health data after you grant the corresponding permissions in Health Connect / Apple Health. You may withdraw this permission at any time in the Health Connect or Apple Health settings. If you voluntarily provide other information to the Service Provider and processing is based on consent, you may withdraw that consent at any time without affecting processing carried out before withdrawal.

### Contact Us

If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at apps@fschoenfeldt.de.
