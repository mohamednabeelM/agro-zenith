// src/pages/Schemes.jsx
// ✅ All 10 schemes translated in Tamil & Hindi — matched by index to data.js SCHEMES

import { useState } from "react";
import C from "../constants/colors";
import { SCHEMES } from "../constants/data";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

// ── Inline Strings ────────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    title:       "Government Schemes",
    subtitle:    "Central & Tamil Nadu agricultural schemes",
    available:   "schemes available",
    eligibility: "Eligibility Criteria",
    documents:   "Required Documents",
    apply:       "Apply →",
    portal:      "Portal",
    active:      "Active",
    yourProfile: "Your profile",
    acres:       "acres",
    various:     "various crops",
    central:     "Central",
    state:       "State",
    noSchemes:   "No schemes available",
  },
  ta: {
    title:       "அரசு திட்டங்கள்",
    subtitle:    "மத்திய & தமிழ்நாடு வேளாண் திட்டங்கள்",
    available:   "திட்டங்கள் கிடைக்கின்றன",
    eligibility: "தகுதி அளவுகோல்கள்",
    documents:   "தேவையான ஆவணங்கள்",
    apply:       "விண்ணப்பிக்க →",
    portal:      "இணையதளம்",
    active:      "செயலில் உள்ளது",
    yourProfile: "உங்கள் சுயவிவரம்",
    acres:       "ஏக்கர்",
    various:     "பல்வேறு பயிர்கள்",
    central:     "மத்திய",
    state:       "மாநில",
    noSchemes:   "திட்டங்கள் எதுவும் இல்லை",
  },
  hi: {
    title:       "सरकारी योजनाएं",
    subtitle:    "केंद्र और तमिलनाडु कृषि योजनाएं",
    available:   "योजनाएं उपलब्ध हैं",
    eligibility: "पात्रता मानदंड",
    documents:   "आवश्यक दस्तावेज",
    apply:       "आवेदन करें →",
    portal:      "पोर्टल",
    active:      "सक्रिय",
    yourProfile: "आपकी प्रोफ़ाइल",
    acres:       "एकड़",
    various:     "विभिन्न फसलें",
    central:     "केंद्रीय",
    state:       "राज्य",
    noSchemes:   "कोई योजना उपलब्ध नहीं",
  },
};

// ── Scheme content translations ───────────────────────────────────────────────
// 10 entries — one per scheme in SCHEMES (data.js), matched by index:
// 0 PM-KISAN | 1 PM Fasal Bima | 2 NMSA | 3 Soil Health Card
// 4 PM Sinchayee | 5 TN-IAMWARM | 6 eNAM | 7 NFSM-Pulses | 8 AIF | 9 SMAM
const SCHEME_TRANSLATIONS = {
  ta: [
    // 0 ── PM-KISAN
    {
      name:        "PM-KISAN",
      tag:         "மத்திய",
      amount:      "₹6,000/ஆண்டு",
      desc:        "சிறு மற்றும் குறு விவசாயிகளுக்கு ₹6,000 நேரடி வருமான ஆதரவு மூன்று தவணைகளாக (₹2,000 × 3) நேரடியாக வங்கிக் கணக்கில் வழங்கப்படுகிறது.",
      eligibility: "விளை நிலம் கொண்ட அனைத்து விவசாயக் குடும்பங்களும் தகுதியுடையவர்கள். அரசு ஊழியர்கள், வருமான வரி கட்டுபவர்கள் மற்றும் நிறுவன நில உரிமையாளர்கள் தவிர.",
      docs:        ["ஆதார் அட்டை", "பட்டா / நில பத்திர ஆவணம்", "DBT வங்கி கணக்கு"],
      portal:      "https://pmkisan.gov.in",
    },
    // 1 ── PM Fasal Bima Yojana
    {
      name:        "PM பயிர் காப்பீட்டு திட்டம்",
      tag:         "மத்திய",
      amount:      "2% பிரீமியம்",
      desc:        "இயற்கை பேரழிவு, பூச்சி மற்றும் நோயால் பயிர் இழப்பு ஏற்படும்போது மிகக் குறைந்த பிரீமியத்தில் விவசாயிகளுக்கு நிதி ஆதரவு அளிக்கிறது.",
      eligibility: "அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை பயிரிடும் அனைத்து விவசாயிகளும். KCC கடன் விவசாயிகளுக்கு கட்டாயம்; மற்றவர்களுக்கு விருப்பத்தேர்வு.",
      docs:        ["ஆதார் அட்டை", "நில பத்திர ஆவணம்", "விதைப்பு சான்றிதழ்"],
      portal:      "https://pmfby.gov.in",
    },
    // 2 ── NMSA
    {
      name:        "தேசிய நிலைத்த வேளாண்மை இயக்கம் (NMSA)",
      tag:         "மத்திய",
      amount:      "மானியங்கள் மாறுபடும்",
      desc:        "காலநிலை மாற்றத்திற்கு ஏற்ற வேளாண்மை, மண் ஆரோக்கிய மேலாண்மை மற்றும் ஒருங்கிணைந்த பண்ணை முறைகளை ஊக்குவிக்கிறது.",
      eligibility: "அனைத்து விவசாயிகளும் தகுதியுடையவர்கள். 2 ஹெக்டேர் கீழ் உள்ள சிறு & குறு விவசாயிகள், மழையை சார்ந்த மற்றும் வறட்சி பாதிப்பு மாவட்டங்களில் உள்ளவர்களுக்கு முன்னுரிமை.",
      docs:        ["ஆதார் அட்டை", "நில பத்திர ஆவணம்", "மண் ஆரோக்கிய அட்டை", "வங்கி பாஸ்புக்"],
      portal:      "https://nmsa.dac.gov.in/",
    },
    // 3 ── Soil Health Card
    {
      name:        "மண் ஆரோக்கிய அட்டை",
      tag:         "இலவச பரிசோதனை",
      amount:      "இலவசம்",
      desc:        "NPK மற்றும் நுண்ணூட்டச்சத்து பரிசோதனையுடன் உரப் பரிந்துரை வழங்கப்படுகிறது. ஒவ்வொரு 2 ஆண்டுகளுக்கும் ஒருமுறை.",
      eligibility: "விவசாய நிலம் உள்ள எந்த விவசாயியும் விண்ணப்பிக்கலாம். வருமான அல்லது நிலப் பரப்பு கட்டுப்பாடு இல்லை. ஒவ்வொரு நிலத்திற்கும் 2 ஆண்டுகளுக்கு ஒருமுறை பரிசோதனை.",
      docs:        ["ஆதார் அட்டை", "சர்வே எண்"],
      portal:      "https://soilhealth.dac.gov.in",
    },
    // 4 ── PM Sinchayee Yojana
    {
      name:        "PM நீர்ப்பாசன திட்டம் (PMKSY)",
      tag:         "நீர்ப்பாசனம்",
      amount:      "55–90% மானியம்",
      desc:        "சொட்டு நீர்ப்பாசனம் / தெளிப்பு நீர்ப்பாசனம் அமைப்புகளுக்கு மானியம். சிறு விவசாயிகளுக்கு 90% வரை மானியம் கிடைக்கும்.",
      eligibility: "அனைத்து விவசாயிகளும். 2 ஹெக்டேர் கீழ் உள்ள சிறு & குறு விவசாயிகளுக்கு 90% மானியம்; மற்றவர்களுக்கு 55–80%. FPO, SHG, கூட்டுறவு சங்கங்களும் தகுதியுடையவை.",
      docs:        ["ஆதார் அட்டை", "நில பத்திர ஆவணம்", "உபகரண விற்பனையாளர் மதிப்பீடு"],
      portal:      "https://pmksy.gov.in",
    },
    // 5 ── TN-IAMWARM
    {
      name:        "TN-IAMWARM திட்டம்",
      tag:         "நீர் திறன்",
      amount:      "தொழில்நுட்ப ஆதரவு",
      desc:        "தமிழ்நாட்டில் நீர்ப்பாசன நவீனமயமாக்கல், நீர்நிலைகள் புனரமைப்பு மற்றும் விவசாயிகளுக்கு நீர் பயன்பாட்டு திறன் மேம்பாடு.",
      eligibility: "குறிப்பிட்ட IAMWARM துணை-நீர்வடிகால் மற்றும் கட்டளை பகுதிகளில் உள்ள தமிழ்நாடு விவசாயிகள். சிறு & குறு விவசாயிகள் மற்றும் நீர் பயனர் சங்கங்களுக்கு (WUA) முன்னுரிமை.",
      docs:        ["சிட்டா/அடங்கல்", "ஆதார் அட்டை", "ரேஷன் அட்டை", "நில இருப்பிட வரைபடம்"],
      portal:      "https://it.tn.gov.in/en/ELCOT/IAMWARM_Project",
    },
    // 6 ── eNAM Direct Sale
    {
      name:        "eNAM நேரடி விற்பனை",
      tag:         "சந்தை",
      amount:      "இலவச பட்டியல்",
      desc:        "தேசிய வேளாண் சந்தையில் நேரடியாக விற்பனை செய்து சிறந்த விலை பெறுங்கள். 1000+ மண்டிகளில் தரகர் இல்லாமல் விற்கலாம்.",
      eligibility: "உற்பத்தி விற்க விரும்பும் எந்த விவசாயியும். உள்ளூர் APMC/மண்டியில் பதிவு செய்திருக்க வேண்டும். FPO மற்றும் விவசாயி கூட்டமைப்புகள் மொத்த விற்பனையாளராக பதிவு செய்யலாம்.",
      docs:        ["ஆதார் அட்டை", "வங்கி கணக்கு", "மண்டி பதிவு"],
      portal:      "https://enam.gov.in",
    },
    // 7 ── NFSM-Pulses
    {
      name:        "தேசிய உணவு பாதுகாப்பு இயக்கம் – பருப்பு (NFSM)",
      tag:         "மத்திய",
      amount:      "விதை மானியம்",
      desc:        "கூட்டு நிரூபணங்கள், அதிக மகசூல் தரும் விதை விநியோகம் மற்றும் விவசாய இயந்திர ஆதரவு மூலம் பருப்பு உற்பத்தியை அதிகரிக்க.",
      eligibility: "NFSM அடையாளம் செய்யப்பட்ட மாவட்டங்களில் பருப்பு (துவரை, பாசிப்பருப்பு, உளுந்து, கொள்ளு, கடலை) பயிரிடும் விவசாயிகள். சிறு & குறு விவசாயிகள் மற்றும் SC/ST விவசாயிகளுக்கு முன்னுரிமை.",
      docs:        ["ஆதார் அட்டை", "நில பத்திர ஆவணம் (பட்டா/சிட்டா)", "வங்கி பாஸ்புக்", "சாதி சான்றிதழ் (பொருந்தினால்)"],
      portal:      "https://www.nfsm.gov.in/",
    },
    // 8 ── AIF
    {
      name:        "வேளாண் உள்கட்டமைப்பு நிதி (AIF)",
      tag:         "மத்திய",
      amount:      "3% வட்டி மானியம்",
      desc:        "அறுவடைக்கு பின் மேலாண்மை உள்கட்டமைப்பு மற்றும் சமூக விவசாய சொத்துக்களுக்கான திட்டங்களுக்கு நீண்டகால கடன் நிதி.",
      eligibility: "விவசாயிகள், FPO, PACS, சந்தைப்படுத்தல் கூட்டுறவு சங்கங்கள், SHG, வேளாண் தொழில்முனைவோர், தொடக்க நிறுவனங்கள் மற்றும் மாநில நிறுவனங்கள். தனி விவசாயிகளுக்கு ₹2 கோடி வரை 3% வட்டி மானியத்துடன் கடன்.",
      docs:        ["திட்ட அறிக்கை (DPR)", "ஆதார் அட்டை", "PAN அட்டை", "நில உரிமை ஆவணங்கள்", "வங்கி அறிக்கை"],
      portal:      "https://agriinfra.dac.gov.in/",
    },
    // 9 ── SMAM
    {
      name:        "வேளாண் இயந்திரமயமாக்கல் துணை இயக்கம் (SMAM)",
      tag:         "மத்திய",
      amount:      "40%–50% மானியம்",
      desc:        "டிராக்டர், பவர் டில்லர், டிரோன் உள்ளிட்ட நவீன விவசாய இயந்திரங்கள் வாங்க நிதி உதவி வழங்கப்படுகிறது.",
      eligibility: "அனைத்து விவசாயிகளும். SC/ST மற்றும் சிறு & குறு விவசாயிகளுக்கு (< 2 ஹெக்டேர்) 50% வரை மானியம். பெண் விவசாயிகளுக்கும் முன்னுரிமை. ஒரு விவசாயிக்கு ஒரு கருவிக்கு மட்டும் மானியம்.",
      docs:        ["ஆதார் அட்டை", "நில பத்திர ஆவணம் (பட்டா/சிட்டா)", "வங்கி பாஸ்புக்", "பாஸ்போர்ட் புகைப்படம்", "இயந்திர விலைப்பட்டியல்"],
      portal:      "https://agrimachinery.nic.in/",
    },
  ],

  hi: [
    // 0 ── PM-KISAN
    {
      name:        "पीएम-किसान",
      tag:         "केंद्रीय",
      amount:      "₹6,000/वर्ष",
      desc:        "छोटे और सीमांत किसानों को ₹6,000 की वार्षिक आय सहायता तीन किस्तों में (₹2,000 × 3) सीधे बैंक खाते में दी जाती है।",
      eligibility: "कृषि भूमि वाले सभी किसान परिवार पात्र हैं। सरकारी कर्मचारी, आयकर दाता और संस्थागत भूमि धारक अपात्र हैं।",
      docs:        ["आधार कार्ड", "पट्टा / भूमि रिकॉर्ड", "DBT बैंक खाता"],
      portal:      "https://pmkisan.gov.in",
    },
    // 1 ── PM Fasal Bima Yojana
    {
      name:        "पीएम फसल बीमा योजना",
      tag:         "केंद्रीय",
      amount:      "2% प्रीमियम",
      desc:        "प्राकृतिक आपदा, कीट और रोग से फसल नुकसान पर किसानों को न्यूनतम प्रीमियम पर वित्तीय सहायता।",
      eligibility: "अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान पात्र हैं। KCC ऋणी किसानों के लिए अनिवार्य; अन्य के लिए स्वैच्छिक।",
      docs:        ["आधार कार्ड", "भूमि रिकॉर्ड", "बुवाई प्रमाण पत्र"],
      portal:      "https://pmfby.gov.in",
    },
    // 2 ── NMSA
    {
      name:        "राष्ट्रीय सतत कृषि मिशन (NMSA)",
      tag:         "केंद्रीय",
      amount:      "सब्सिडी भिन्न होती है",
      desc:        "जलवायु अनुकूल कृषि, मिट्टी स्वास्थ्य प्रबंधन और एकीकृत खेती पद्धतियों को बढ़ावा देता है।",
      eligibility: "सभी किसान पात्र हैं। 2 हेक्टेयर से कम वाले छोटे और सीमांत किसानों, वर्षा आधारित और सूखा प्रभावित जिलों के किसानों को प्राथमिकता।",
      docs:        ["आधार कार्ड", "भूमि रिकॉर्ड", "मृदा स्वास्थ्य कार्ड", "बैंक पासबुक"],
      portal:      "https://nmsa.dac.gov.in/",
    },
    // 3 ── Soil Health Card
    {
      name:        "मृदा स्वास्थ्य कार्ड",
      tag:         "निःशुल्क परीक्षण",
      amount:      "निःशुल्क",
      desc:        "NPK और सूक्ष्म पोषक तत्व परीक्षण के साथ उर्वरक अनुशंसा। हर 2 वर्ष में एक बार।",
      eligibility: "कृषि भूमि वाला कोई भी किसान। आय या भूमि आकार की कोई सीमा नहीं। प्रत्येक प्लॉट के लिए हर 2 वर्ष में एक बार परीक्षण।",
      docs:        ["आधार कार्ड", "सर्वे नंबर"],
      portal:      "https://soilhealth.dac.gov.in",
    },
    // 4 ── PM Sinchayee Yojana
    {
      name:        "पीएम कृषि सिंचाई योजना (PMKSY)",
      tag:         "सिंचाई",
      amount:      "55–90% सब्सिडी",
      desc:        "ड्रिप / स्प्रिंकलर सिंचाई प्रणाली पर सब्सिडी। छोटे किसानों को 90% तक सब्सिडी।",
      eligibility: "सभी किसान। 2 हेक्टेयर से कम वाले छोटे और सीमांत किसानों को 90% सब्सिडी; अन्य को 55–80%। FPO, SHG, सहकारी समितियां भी पात्र।",
      docs:        ["आधार कार्ड", "भूमि रिकॉर्ड", "विक्रेता का अनुमान"],
      portal:      "https://pmksy.gov.in",
    },
    // 5 ── TN-IAMWARM
    {
      name:        "TN-IAMWARM परियोजना",
      tag:         "जल दक्षता",
      amount:      "तकनीकी सहायता",
      desc:        "तमिलनाडु में सिंचाई आधुनिकीकरण, जल निकायों की बहाली और किसानों के लिए जल उपयोग दक्षता में सुधार।",
      eligibility: "निर्धारित IAMWARM उप-बेसिन और कमांड क्षेत्रों में तमिलनाडु के किसान। छोटे और सीमांत किसानों तथा जल उपयोगकर्ता संघों (WUA) को प्राथमिकता।",
      docs:        ["चिट्टा/अडंगल", "आधार कार्ड", "राशन कार्ड", "भूमि स्थान मानचित्र"],
      portal:      "https://it.tn.gov.in/en/ELCOT/IAMWARM_Project",
    },
    // 6 ── eNAM Direct Sale
    {
      name:        "eNAM प्रत्यक्ष बिक्री",
      tag:         "बाजार",
      amount:      "निःशुल्क सूचीकरण",
      desc:        "राष्ट्रीय कृषि बाजार पर सीधे बेचें — बेहतर कीमत, कोई बिचौलिया नहीं। 1000+ मंडियों में उपलब्ध।",
      eligibility: "उपज बेचने के इच्छुक कोई भी किसान। स्थानीय APMC/मंडी में पंजीकृत होना आवश्यक। FPO और किसान सहकारी समितियां थोक विक्रेता के रूप में पंजीकरण कर सकती हैं।",
      docs:        ["आधार कार्ड", "बैंक खाता", "मंडी पंजीकरण"],
      portal:      "https://enam.gov.in",
    },
    // 7 ── NFSM-Pulses
    {
      name:        "राष्ट्रीय खाद्य सुरक्षा मिशन – दलहन (NFSM)",
      tag:         "केंद्रीय",
      amount:      "बीज सब्सिडी",
      desc:        "क्लस्टर प्रदर्शनों, उच्च उपज वाले बीजों के वितरण और कृषि मशीनरी सहायता के माध्यम से दलहन उत्पादन बढ़ाना।",
      eligibility: "NFSM पहचानित जिलों में दलहन (तुअर, मूंग, उड़द, मसूर, चना) उगाने वाले किसान। छोटे और सीमांत किसानों तथा SC/ST किसानों को प्राथमिकता।",
      docs:        ["आधार कार्ड", "भूमि रिकॉर्ड (पट्टा/चिट्टा)", "बैंक पासबुक", "जाति प्रमाण पत्र (यदि लागू हो)"],
      portal:      "https://www.nfsm.gov.in/",
    },
    // 8 ── AIF
    {
      name:        "कृषि अवसंरचना निधि (AIF)",
      tag:         "केंद्रीय",
      amount:      "3% ब्याज सब्सिडी",
      desc:        "फसल कटाई के बाद प्रबंधन अवसंरचना और सामुदायिक कृषि संपत्तियों के लिए दीर्घकालिक ऋण वित्तपोषण।",
      eligibility: "किसान, FPO, PACS, विपणन सहकारी समितियां, SHG, कृषि उद्यमी, स्टार्टअप और राज्य एजेंसियां। व्यक्तिगत किसान ₹2 करोड़ तक 3% ब्याज सब्सिडी के साथ ऋण पाने के पात्र।",
      docs:        ["परियोजना रिपोर्ट (DPR)", "आधार कार्ड", "PAN कार्ड", "भूमि स्वामित्व दस्तावेज", "बैंक स्टेटमेंट"],
      portal:      "https://agriinfra.dac.gov.in/",
    },
    // 9 ── SMAM
    {
      name:        "कृषि यंत्रीकरण उप-मिशन (SMAM)",
      tag:         "केंद्रीय",
      amount:      "40%–50% सब्सिडी",
      desc:        "ट्रैक्टर, पावर टिलर, ड्रोन सहित आधुनिक कृषि मशीनरी खरीदने के लिए वित्तीय सहायता।",
      eligibility: "सभी किसान। SC/ST और छोटे व सीमांत किसानों (< 2 हेक्टेयर) को 50% तक सब्सिडी। महिला किसानों को भी प्राथमिकता। एक किसान को एक उपकरण पर एक बार सब्सिडी।",
      docs:        ["आधार कार्ड", "भूमि रिकॉर्ड (पट्टा/चिट्टा)", "बैंक पासबुक", "पासपोर्ट साइज फोटो", "मशीनरी का कोटेशन"],
      portal:      "https://agrimachinery.nic.in/",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
function Schemes({ user, t, lang }) {
  const [open, setOpen] = useState(null);

  const S = STRINGS[lang] || STRINGS.en;

  // ── Safe data ─────────────────────────────────────────────────────────────
  const baseSchemes = Array.isArray(SCHEMES) ? SCHEMES : [];
  const userCrops   = Array.isArray(user?.crops) ? user.crops : [];

  // ── Pick translated scheme content or fall back to base data ─────────────
  const schemeTx = SCHEME_TRANSLATIONS[lang];
  const schemes  = baseSchemes.map((s, i) => ({
    ...s,
    ...(schemeTx?.[i] || {}),      // overlay translation if exists
  }));

  return (
    <div style={{ padding: 22 }}>
      <h1 style={{ fontSize: 21, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
        🏛️ {S.title}
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 6px" }}>{S.subtitle}</p>

      {/* ── Profile banner ────────────────────────────────────────────────── */}
      <div style={{
        padding: "10px 14px", background: C.pale,
        borderRadius: 8, fontSize: 13, color: C.bg2, marginBottom: 16,
      }}>
        ✅ {S.yourProfile}: <strong>{user?.name}</strong> • {user?.district} •{" "}
        {user?.landSize || "?"} {S.acres} •{" "}
        {userCrops.slice(0, 3).join(", ") || S.various} —{" "}
        <strong>{schemes.length} {S.available}</strong>
      </div>

      {/* ── Scheme list ───────────────────────────────────────────────────── */}
      {schemes.length === 0 && (
        <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: 32 }}>
          {S.noSchemes}
        </div>
      )}

      {schemes.map((s, i) => (
        <Card key={i} style={{ marginBottom: 10 }}>
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div style={{ flex: 1, marginRight: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: C.text }}>{s.name}</span>
                <Badge>{s.tag}</Badge>
                <Badge color={C.amber} bg={C.amberPale}>{s.amount}</Badge>
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.45 }}>{s.desc}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end", flexShrink: 0 }}>
              <Badge color={C.bg2}>● {S.active}</Badge>
              <button
                onClick={e => { e.stopPropagation(); window.open(s.portal, "_blank"); }}
                style={{
                  padding: "6px 13px", background: C.bg2, color: "#fff",
                  borderRadius: 7, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500,
                }}
              >
                {S.apply}
              </button>
            </div>
          </div>

          {/* ── Expanded details ─────────────────────────────────────────── */}
          {open === i && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>

              {/* Eligibility */}
              <div style={{ marginBottom: 10, padding: "10px 12px", background: C.pale, borderRadius: 8 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 4 }}>
                  ✅ {S.eligibility}:
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{s.eligibility}</div>
              </div>

              {/* Documents */}
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 6 }}>
                📄 {S.documents}:
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
                {(Array.isArray(s.docs) ? s.docs : []).map((d, di) => (
                  <span key={di} style={{
                    padding: "4px 10px", background: C.bg, borderRadius: 6,
                    fontSize: 12, color: C.text, border: `1px solid ${C.border}`,
                  }}>
                    📄 {d}
                  </span>
                ))}
              </div>

              {/* Portal */}
              <div style={{ fontSize: 12, color: C.muted }}>
                🌐 {S.portal}:{" "}
                <a href={s.portal} target="_blank" rel="noreferrer" style={{ color: C.bg2 }}>
                  {s.portal}
                </a>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

export default Schemes;