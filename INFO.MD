# VendorProof — Project Information

## Overview

VendorProof is an AI-powered vendor trust and verification platform designed for Nigeria’s informal commerce ecosystem.

Millions of vendors across Twitter, WhatsApp, Instagram, Facebook Marketplace, Jiji, and physical markets receive payments daily without any verifiable trust layer. Buyers often get scammed because there is no easy way to confirm whether a vendor is legitimate before sending money.

VendorProof solves this by creating a portable trust identity for vendors.

The platform verifies vendor documents, validates biometric identity, analyzes transaction behavior, and generates a public Trust Badge that buyers can inspect before paying.

Each Trust Badge includes:

- Vendor identity
- Trust score
- Verification status
- Behavioral trust tier
- Squad payment link
- QR code for payments

The system integrates deeply with Squad APIs so trust improves automatically as vendors successfully process more payments.

---

# Core Problem

The problem is NOT that vendors cannot receive payments.

The real problem is:

- buyers cannot verify vendors,
- informal merchants lack trusted identity,
- and payment links alone do not create confidence.

Today:

- scammers can collect money with only a bank account number,
- legitimate vendors lose buyers because they cannot prove credibility,
- and fintech companies cannot extend services to vendors with no verified reputation layer.

VendorProof introduces a trust infrastructure for informal commerce.

---

# Core Solution

VendorProof provides:

1. AI-powered identity verification
2. Behavioral trust scoring
3. Public trust profiles
4. Squad-powered payment infrastructure

The platform determines:

- Is the document real?
- Is the person who they claim to be?
- Does their transaction behavior look trustworthy?

The output is a live, explainable Trust Score.

---

# Product Goals

The product aims to:

- reduce marketplace fraud,
- improve buyer confidence,
- help vendors build portable trust,
- and create behavioral financial reputation for informal merchants.

Long term, VendorProof could become:

- a trust layer for African commerce,
- vendor reputation infrastructure,
- embedded merchant verification APIs,
- or alternative trust scoring for lenders and marketplaces.

---

# Primary Features

## 1. Document Verification

Vendors upload:

- NIN slip
- CAC certificate
- utility bill
- or other identity documents

The AI engine performs:

- OCR text extraction
- field consistency checks
- document authenticity analysis
- tampering detection
- anomaly detection

Outputs:

- extracted identity data
- authenticity score
- flagged anomalies
- verification status

Example:

- "NIN format valid"
- "No tampering detected"
- "Name matches uploaded selfie"

---

## 2. Face Match & Liveness Verification

Vendor submits a live selfie.

The system:

- compares selfie against ID photo,
- calculates face similarity confidence,
- and performs liveness checks.

Liveness checks may include:

- blink detection
- head turn verification
- anti-static-image checks

Outputs:

- biometric confidence score
- liveness pass/fail

---

## 3. Behavioral Trust Engine

This is the long-term intelligence layer.

Every Squad payment event is streamed into the backend through webhooks.

The system continuously evaluates:

- transaction frequency
- consistency
- dispute rate
- chargebacks
- sudden payment spikes
- unusual transaction velocity
- order value stability

This creates a behavioral trust reputation over time.

Trust tiers:

- Bronze
- Silver
- Gold
- Platinum

The trust model compounds with activity.

---

## 4. Composite Trust Score

VendorProof combines:

- Document Verification Score
- Biometric Verification Score
- Behavioral Trust Score

into a single explainable score from 0–100.

Formula:
Trust Score = 35% Document + 35% Biometric + 30% Behavioral

The score must always remain:

- explainable,
- auditable,
- and human-readable.

Example:
"Your Trust Score is 87/100.
Document verification passed.
Identity match confidence: 94%.
Behavioral tier: Silver."

---

## 5. Trust Badge

The Trust Badge is the public-facing trust profile.

It includes:

- vendor name
- profile photo
- verified status
- business category
- trust score
- behavioral tier
- Squad payment link
- QR code

The badge is:

- shareable,
- public,
- portable,
- and updates live over time.

This allows buyers to inspect trust before making payments.

---

# Squad API Integration

Squad integration is structural and core to the platform.

Without Squad:

- onboarding payments fail,
- payment links do not exist,
- behavioral scoring has no data source,
- and trust cannot evolve over time.

The project uses:

## Collections API

Used for onboarding fee payments during vendor registration.

## Payment Links API

Each vendor receives a unique Squad payment link embedded into their Trust Badge.

## Webhooks

Every payment event triggers:

- behavioral score recalculation,
- transaction history updates,
- and live trust updates.

## Transfers API (Future Scope)

Potential future support for:

- payouts,
- refunds,
- escrow,
- vendor disbursements.

---

# AI Architecture

VendorProof uses a multi-layer AI pipeline.

## A. Document Intelligence Layer

Responsibilities:

- OCR extraction
- authenticity scoring
- anomaly detection
- template validation
- field consistency analysis

Possible technologies:

- Claude API
- OCR engines
- image analysis heuristics

---

## B. Biometric Verification Layer

Responsibilities:

- facial similarity matching
- liveness detection
- identity confidence scoring

Possible technologies:

- DeepFace
- FaceIO

---

## C. Behavioral Intelligence Layer

Responsibilities:

- transaction pattern analysis
- dispute analysis
- anomaly detection
- trust tier updates

This layer continuously evolves as more transactions occur.

---

# Technical Stack

## Mobile Frontend

- React Native
- Expo
- Expo Router
- NativeWind

Responsibilities:

- onboarding flow
- camera capture
- document upload
- Trust Badge display
- dashboard

# Core User Flow

## Step 1 — Vendor Signup

Vendor creates account and pays onboarding fee via Squad.

## Step 2 — Document Upload

Vendor uploads NIN or CAC.
AI verifies authenticity.

## Step 3 — Face Verification

Vendor takes selfie.
System performs face match and liveness checks.

## Step 4 — Trust Score Generation

Composite score is calculated.

## Step 5 — Trust Badge Issued

Public vendor badge generated with Squad payment link.

## Step 6 — Buyer Makes Payment

Buyer opens badge and pays through Squad.

## Step 7 — Webhook Updates Score

Squad webhook triggers behavioral recalculation.

## Step 8 — Trust Compounds Over Time

Vendor reputation improves with successful activity.

---

# Design Philosophy

The platform should feel:

- modern,
- trustworthy,
- transparent,
- explainable,
- and financial-grade.

The UI should communicate:

- confidence,
- verification,
- legitimacy,
- and clarity.

Avoid:

- clutter,
- overly playful interfaces,
- crypto aesthetics,
- or generic dashboard designs.

The product should resemble:

- a modern fintech trust platform.

---

# Important Scope Decisions

The project intentionally does NOT include:

## No Live Government Verification APIs

No direct NIMC/NIBSS integrations.
Verification is AI-assisted analysis only.

## No Lending Engine

Trust score is NOT a formal credit score.

## No Custom ML Training

Use existing models/services for hackathon scope.

## No Complex Fraud Forensics

Simple anomaly detection is sufficient.

The focus is:

- trust,
- explainability,
- verification,
- and smooth demo execution.

---

# Demo Priorities

The demo must prioritize:

1. smooth onboarding
2. document verification
3. face match
4. Trust Badge generation
5. Squad payment flow
6. webhook-driven score updates

The demo should feel:

- fast,
- visual,
- reliable,
- and polished.

A stable 3-minute demo is more important than excessive features.

---

# Key Product Philosophy

VendorProof is not just a payment product.

It is:

- a trust infrastructure,
- a reputation engine,
- and a portable identity layer

for informal African commerce.
