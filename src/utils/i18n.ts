/**
 * Localization (i18n) for StudioOS Site App
 * Supported languages: English ('en'), Hindi ('hi'), Marathi ('mr')
 * (Marathi falls back to English per specification)
 */

export type SiteLanguage = 'en' | 'hi' | 'mr';

const LANGUAGE_STORAGE_KEY = 'studioos_site_language';

export function getSiteLanguage(): SiteLanguage {
  try {
    const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (lang === 'hi' || lang === 'mr' || lang === 'en') {
      return lang;
    }
  } catch {}
  return 'en';
}

export function setSiteLanguage(lang: SiteLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent('studioos_language_change', { detail: { lang } }));
  } catch (err) {
    console.error('Failed to save language setting:', err);
  }
}

export const TRANSLATIONS: Record<string, { en: string; hi: string; mr: string }> = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम', mr: 'होम' },
  'nav.stock': { en: 'Stock', hi: 'स्टॉक', mr: 'स्टॉक' },
  'nav.me': { en: 'Me', hi: 'मेरी जानकारी', mr: 'माझी माहिती' },

  // Home Screen
  'home.active_site': { en: 'Active Site', hi: 'सक्रिय साइट', mr: 'सक्रिय साइट' },
  'home.switch_site': { en: 'Switch site', hi: 'साइट बदलें', mr: 'साइट बदला' },
  'home.todays_focus': { en: "Today's focus", hi: 'आज का काम', mr: 'आजचे काम' },
  'home.actions': { en: 'Actions', hi: 'काम की सूची', mr: 'कामांची यादी' },
  'home.material_received': { en: 'Material received', hi: 'सामान आया (डिलीवरी)', mr: 'साहित्य आले (डिलिव्हरी)' },
  'home.material_received_sub': { en: 'Bill or challan photo', hi: 'बिल या चालान की फोटो', mr: 'बिल किंवा चालान फोटो' },
  'home.material_received_trade': { en: 'Material received', hi: 'सामान आया', mr: 'साहित्य आले' },
  'home.material_received_trade_sub': { en: 'Record delivery if supervisor is not on site', hi: 'सुपरवाइजर मौजूद न होने पर डिलीवरी दर्ज करें', mr: 'सुपरव्हायझर नसल्यास नोंद करा' },
  'home.material_used': { en: 'Material used', hi: 'सामान लगा (इस्तेमाल हुआ)', mr: 'साहित्य वापरले' },
  'home.material_used_sub': { en: 'Log items used today', hi: 'आज लगा हुआ सामान दर्ज करें', mr: 'आज वापरलेले साहित्य नोंदवा' },
  'home.work_done': { en: 'Work done', hi: 'किया हुआ काम', mr: 'झालेले काम' },
  'home.work_done_sub': { en: 'Photos & updates', hi: 'फोटो और काम की प्रगति', mr: 'फोटो आणि कामाची प्रगती' },
  'home.progress_update': { en: 'Progress update', hi: 'प्रगति अपडेट', mr: 'प्रगती अपडेट' },
  'home.progress_update_sub': { en: 'Photos & status', hi: 'फोटो और स्टेटस', mr: 'फोटो आणि स्टेटस' },
  'home.stock_check': { en: 'Stock check', hi: 'स्टॉक चेक', mr: 'स्टॉक तपासणी' },
  'home.stock_check_sub': { en: 'Count site stock', hi: 'साइट का सामान गिनें', mr: 'साइटवरील साहित्य मोजा' },
  'home.report_problem': { en: 'Report a problem', hi: 'समस्या बताएं', mr: 'समस्या कळवा' },
  'home.report_problem_sub': { en: 'Flag an issue or delay', hi: 'काम में रुकावट या समस्या बताएं', mr: 'अडचण किंवा विलंब कळवा' },
  'home.todays_logs': { en: "Today's logs", hi: 'आज का दर्ज काम', mr: 'आजची नोंद' },
  'home.nothing_logged': { en: 'Nothing logged yet today', hi: 'आज अभी तक कुछ दर्ज नहीं हुआ', mr: 'आज काही नोंदवले नाही' },
  'home.nothing_logged_sub': { en: 'Use the actions above to record what happened on site.', hi: 'साइट का काम दर्ज करने के लिए ऊपर दिए बटन दबाएं।', mr: 'वरील बटणे वापरून काम नोंदवा.' },
  'home.delivery_needs_check': { en: 'Delivery needs your check', hi: 'डिलीवरी चेक करना जरूरी है', mr: 'डिलिव्हरी तपासणे आवश्यक' },
  'home.confirm_quantities': { en: 'Confirm quantities', hi: 'सामान की पुष्टि करें', mr: 'साहित्य खात्री करा' },
  'home.correct': { en: 'Correct', hi: 'सही करें', mr: 'दुरुस्त करा' },

  // Material Used
  'used.title': { en: 'Material used', hi: 'सामान लगा', mr: 'साहित्य वापरले' },
  'used.subtitle': { en: 'Log materials installed or consumed on site today', hi: 'साइट पर आज इस्तेमाल हुआ सामान दर्ज करें', mr: 'आज वापरलेले साहित्य नोंदवा' },
  'used.room_area': { en: 'Room / Area', hi: 'कमरा / जगह', mr: 'खोली / जागा' },
  'used.selected_room': { en: 'Selected', hi: 'चुना हुआ', mr: 'निवडलेले' },
  'used.by_category': { en: 'Materials by Category', hi: 'केटेगरी अनुसार सामान', mr: 'विभागानुसार साहित्य' },
  'used.your_trade': { en: 'Your trade', hi: 'आपका काम', mr: 'तुमचे काम' },
  'used.in_stock': { en: 'In stock', hi: 'स्टॉक में', mr: 'स्टॉकमध्ये' },
  'used.out_of_stock': { en: 'Out of stock', hi: 'स्टॉक खत्म', mr: 'स्टॉक संपला' },
  'used.submit_button': { en: 'Submit material used', hi: 'इस्तेमाल हुआ सामान दर्ज करें', mr: 'वापरलेले साहित्य नोंदवा' },
  'used.select_items': { en: 'Select materials used', hi: 'सामान चुनें', mr: 'साहित्य निवडा' },

  // Material Received
  'recv.title': { en: 'Record material received', hi: 'सामान की डिलीवरी दर्ज करें', mr: 'साहित्य आले नोंद करा' },
  'recv.subtitle': { en: 'Increases site stock immediately and records challan for office review', hi: 'साइट स्टॉक तुरंत बढ़ेगा और बिल ऑफिस रिव्यू के लिए जाएगा', mr: 'स्टॉक तात्काळ वाढेल आणि बिल तपासणीसाठी जाईल' },
  'recv.challan_photo': { en: 'Challan or Bill Photo', hi: 'चालान या बिल की फोटो', mr: 'चालान किंवा बिल फोटो' },
  'recv.take_photo': { en: 'Take photo', hi: 'फोटो लें', mr: 'फोटो घ्या' },
  'recv.sample_photo': { en: 'Use sample challan', hi: 'सैंपल चालान लगाएं', mr: 'नमुना चालान वापरा' },
  'recv.no_bill': { en: 'No bill/challan received with delivery', hi: 'डिलीवरी के साथ बिल/चालान नहीं मिला', mr: 'डिलिव्हरी सोबत बिल मिळाले नाही' },
  'recv.vendor': { en: 'Supplier / Vendor', hi: 'दुकानदार / सप्लायर', mr: 'सप्लायर' },
  'recv.challan_no': { en: 'Challan / Bill No.', hi: 'चालान या बिल नंबर', mr: 'चालान किंवा बिल क्र.' },
  'recv.date': { en: 'Date', hi: 'तारीख', mr: 'तारीख' },
  'recv.materials_heading': { en: 'Delivered Materials', hi: 'आया हुआ सामान', mr: 'आलेले साहित्य' },
  'recv.category': { en: 'Category', hi: 'केटेगरी', mr: 'वर्ग' },
  'recv.material': { en: 'Material', hi: 'सामान', mr: 'साहित्य' },
  'recv.qty_received': { en: 'Quantity received', hi: 'आई हुई मात्रा', mr: 'आलेली संख्या' },
  'recv.add_another': { en: '+ Add another item', hi: '+ दूसरा सामान जोड़ें', mr: '+ आणखी साहित्य जोडा' },
  'recv.submit_button': { en: 'Record delivery', hi: 'डिलीवरी सेव करें', mr: 'डिलिव्हरी जतन करा' },

  // Work Done / Progress Update
  'prog.title': { en: 'Work done', hi: 'किया हुआ काम', mr: 'झालेले काम' },
  'prog.subtitle': { en: 'Share photos and progress updates for your trade', hi: 'अपने काम की फोटो और प्रगति अपडेट करें', mr: 'कामाचे फोटो आणि प्रगती अपडेट करा' },
  'prog.room': { en: 'Room / Area', hi: 'कमरा / जगह', mr: 'खोली / जागा' },
  'prog.trade': { en: 'Trade', hi: 'काम का प्रकार', mr: 'काम' },
  'prog.status': { en: 'Progress status', hi: 'काम कितना हुआ?', mr: 'काम किती झाले?' },
  'prog.photos': { en: 'Photos (1 to 3)', hi: 'काम की फोटो (1 से 3)', mr: 'कामाचे फोटो (1 ते 3)' },
  'prog.notes': { en: 'Notes (optional)', hi: 'नोट्स (वैकल्पिक)', mr: 'टीप (पर्यायी)' },
  'prog.submit': { en: 'Submit work update', hi: 'काम अपडेट करें', mr: 'काम सबमिट करा' },

  // Report a Problem
  'prob.title': { en: 'Report a problem', hi: 'समस्या बताएं', mr: 'समस्या कळवा' },
  'prob.subtitle': { en: 'Notify your supervisor and office of issues or blockers', hi: 'सुपरवाइजर और ऑफिस को साइट की समस्या बताएं', mr: 'सुपरव्हायझर आणि ऑफिसला समस्या कळवा' },
  'prob.room_optional': { en: 'Room / Area (optional)', hi: 'कमरा / जगह (वैकल्पिक)', mr: 'खोली / जागा (पर्यायी)' },
  'prob.type': { en: 'Problem type', hi: 'समस्या का प्रकार', mr: 'समस्येचा प्रकार' },
  'prob.type_material_missing': { en: 'Material missing', hi: 'सामान नहीं मिला', mr: 'साहित्य कमी आहे' },
  'prob.type_waiting_for_trade': { en: 'Waiting for another trade', hi: 'दूसरे कारीगर का इंतज़ार', mr: 'दुसऱ्या कारागिराची वाट' },
  'prob.type_design_question': { en: 'Design question', hi: 'डिज़ाइन में संशय', mr: 'डिझाईन शंका' },
  'prob.type_damage': { en: 'Damage', hi: 'खराबी या टूट-फूट', mr: 'नुकसान किंवा तुटफूट' },
  'prob.type_other': { en: 'Other', hi: 'अन्य समस्या', mr: 'इतर समस्या' },
  'prob.description': { en: 'Describe the issue', hi: 'समस्या का विवरण लिखें', mr: 'समस्येचे वर्णन' },
  'prob.photo_optional': { en: 'Photo (optional)', hi: 'फोटो (वैकल्पिक)', mr: 'फोटो (पर्यायी)' },
  'prob.submit': { en: 'Submit problem', hi: 'समस्या भेजें', mr: 'समस्या पाठवा' },

  // Me Tab
  'me.assigned_sites': { en: 'Assigned Sites', hi: 'सौंपी गई साइटें', mr: 'नेमून दिलेल्या साइट्स' },
  'me.language': { en: 'App Language', hi: 'ऐप की भाषा', mr: 'अ‍ॅपची भाषा' },
  'me.install_app': { en: 'Install App on Phone', hi: 'फोन पर ऐप इंस्टॉल करें', mr: 'फोनवर अ‍ॅप इन्स्टॉल करा' },
  'me.sign_out': { en: 'Sign out', hi: 'लॉग आउट करें', mr: 'बाहेर पडा' },
};

export function t(key: string, lang?: SiteLanguage): string {
  const currentLang = lang || getSiteLanguage();
  const entry = TRANSLATIONS[key];
  if (!entry) return key;

  if (currentLang === 'hi') return entry.hi || entry.en;
  if (currentLang === 'mr') return entry.mr || entry.en; // Marathi falls back to English if missing
  return entry.en;
}
