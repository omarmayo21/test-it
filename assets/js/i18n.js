/* ============================================================================
   SOLUTIONS CASTLE — Global Bilingual Translation Engine (EN / AR)
   Preserves 100% fidelity to approved source copy with persistence
   ========================================================================= */
(() => {
  'use strict';

  const TRANSLATIONS = {
    en: {
      // ── Header & Navigation ──
      "nav_home": "Home",
      "nav_about": "About Us",
      "nav_it": "IT Services",
      "nav_training": "Training",
      "nav_industries": "Industries",
      "nav_contact": "Contact",
      "nav_cta": "Let's talk",
      "nav_tagline": "IT · TRAINING · AI",
      "menu_eyebrow": "Solutions Castle",
      "menu_foot": "IT Services & Training",
      "menu_cta": "Request Consultation",
      "sla_badge": "Committed to response & custom proposals within 1 business day",

      // ── Footer ──
      "footer_tagline": "The integrated framework for enterprise enablement and sustainable digital transformation across the UAE, KSA, and Egypt.",
      "footer_quick_links": "Quick Links",
      "footer_credentials": "Accreditations & Partnerships",
      "footer_khda": "KHDA Licensed — Dubai Govt",
      "footer_cpd": "International CPD Accredited",
      "footer_icv": "National In-Country Value (ICV)",
      "footer_oracle": "Certified Oracle Partner",
      "footer_hubs": "Regional Hubs",
      "footer_hub_dubai": "Dubai — Sheikh Zayed Road",
      "footer_hub_riyadh": "Riyadh — Kingdom of Saudi Arabia",
      "footer_hub_cairo": "Cairo — Arab Republic of Egypt",
      "footer_copy": "© 2026 Solutions Castle. All rights reserved.",
      "footer_legal": "Licensed by the Knowledge and Human Development Authority (KHDA)",

      // ── Landing Page (Section 01 to 10) ──
      "hero_eyebrow": "Solutions Castle // IT Services & Training",
      "hero_title_1": "Building",
      "hero_title_2": "Capability.",
      "hero_lede": "Solutions Castle delivers professional IT services and technical training engineered to help organisations build stronger technology and human capability.",
      "hero_cta_talk": "Let's talk",
      "hero_cta_explore": "Explore services",
      "hero_meta_services": "IT Services",
      "hero_meta_training": "Training",

      "who_eyebrow": "01 Who we are",
      "who_title": "Who<br />we are",
      "who_lead": "Solutions Castle is an IT services and training company built on one idea: technology only creates value when the people around it can operate it with confidence.",
      "who_stmt_1_title": "Engineered delivery",
      "who_stmt_1_desc": "Systems designed, deployed and supported with discipline.",
      "who_stmt_2_title": "Human capability",
      "who_stmt_2_desc": "Training that turns teams into operators, not spectators.",
      "who_stmt_3_title": "Long-term partnership",
      "who_stmt_3_desc": "We stay after go-live. That is where value compounds.",

      "what_eyebrow": "02 What we do",
      "what_title": "What<br />we do",
      "what_lead": "Two connected capabilities, engineered to reinforce each other.",
      "fork_name_a": "IT<br />Services",
      "fork_desc_a": "Infrastructure, cloud, security and support — run as one system.",
      "fork_name_b": "Train&shy;ing",
      "fork_desc_b": "Practical programmes that build real operational capability.",

      "it_eyebrow": "03 IT Services",
      "it_title": "IT<br />Services",
      "it_lead": "Technology delivery without fragmentation. We design, build and run enterprise environments that perform.",
      "it_idx_1_title": "IT Infrastructure",
      "it_idx_1_desc": "Core systems, compute, storage and networks designed for resilience.",
      "it_idx_2_title": "Cloud & Systems",
      "it_idx_2_desc": "Migrations, hybrid deployments and modern operating platforms.",
      "it_idx_3_title": "Cybersecurity",
      "it_idx_3_desc": "Hardening, monitoring and threat protection built into the baseline.",
      "it_idx_4_title": "Networking & Comms",
      "it_idx_4_desc": "Fast, redundant connectivity across sites and campuses.",
      "it_idx_5_title": "Technical Support",
      "it_idx_5_desc": "Proactive management, response and tier-structured maintenance.",
      "it_idx_6_title": "Digital Solutions",
      "it_idx_6_desc": "Custom application environments and modern workflow integrations.",
      "it_explore_cta": "Explore IT Services",

      "training_eyebrow": "04 Training",
      "training_title": "Train&shy;ing",
      "training_lead": "Capability over certification. We run instructor-led, scenario-based technical programmes that produce real practitioners.",
      "tr_idx_1_title": "Technical Training",
      "tr_idx_1_desc": "Hands-on labs across systems, networks, cloud and security domains.",
      "tr_idx_2_title": "Professional Development",
      "tr_idx_2_desc": "Structured progression tracks for engineering and operations teams.",
      "tr_idx_3_title": "IT Skills Acceleration",
      "tr_idx_3_desc": "Fast-track onboarding and upskilling for modern technical baselines.",
      "tr_idx_4_title": "Practical Learning",
      "tr_idx_4_desc": "Scenario-driven training built on real production architectures.",
      "tr_idx_5_title": "Workforce Capability",
      "tr_idx_5_desc": "Long-term skill transformation aligned with organisational goals.",
      "tr_explore_cta": "Explore Training",

      "how_eyebrow": "05 How we work",
      "how_title": "How<br />we work",
      "how_lead": "A disciplined, step-by-step engagement model that ensures predictable delivery and measurable outcomes.",
      "stage_1_name": "Discover",
      "stage_1_desc": "Understand the environment, constraints and true requirements.",
      "stage_2_name": "Plan",
      "stage_2_desc": "Architect the solution, timelines and capability milestones.",
      "stage_3_name": "Build",
      "stage_3_desc": "Deploy systems, run training and integrate with discipline.",
      "stage_4_name": "Optimise",
      "stage_4_desc": "Tune performance, harden security and embed operational habits.",
      "stage_5_name": "Support",
      "stage_5_desc": "Maintain systems, refresh skills and ensure ongoing stability.",

      "ind_eyebrow": "06 Industries",
      "ind_title": "Indus&shy;tries",
      "ind_lead": "Experience delivering technical services and training across diverse operational environments.",
      "ind_1": "Enterprise",
      "ind_2": "Government",
      "ind_3": "Education",
      "ind_4": "Healthcare",
      "ind_5": "Financial",
      "ind_6": "Logistics",
      "ind_7": "Hospitality",
      "ind_8": "Energy",

      "conn_eyebrow": "07 The connection",
      "conn_title": "The<br />Connection",
      "conn_lead": "Services build the platform. Training equips the people. Together, they create operational independence.",
      "conn_label_l": "IT Services",
      "conn_label_r": "Training",

      "dest_eyebrow": "08 Two destinations",
      "dest_lead": "Two entry points. One connected organisation.",
      "gate_1_title": "IT<br />Services",
      "gate_1_desc": "Start with an environment assessment.",
      "gate_1_go": "Overview",
      "gate_2_title": "Train&shy;ing",
      "gate_2_desc": "Start with a capability review.",
      "gate_2_go": "Overview",
      "gates_note": "Two entry points. One connected organisation.",

      "fin_eyebrow": "09 Solutions Castle",
      "fin_title_1": "Let's build",
      "fin_title_2": "what's next.",
      "fin_cta": "Let's talk",

      // ── About Us Page ──
      "about_eyebrow": "About Solutions Castle",
      "about_h1": "Your Integrated Partner for Institutional Enablement and Sustainable Digital Transformation.",
      "about_sub": "Solutions Castle was established as a comprehensive ecosystem merging accredited professional training with intelligent software development, serving enterprises and government entities across the UAE, Saudi Arabia, and Egypt.",
      "about_cred_khda": "Licensed by the Knowledge and Human Development Authority — Government of Dubai (KHDA).",
      "about_cred_cpd": "Accredited for International Continuing Professional Development (CPD).",
      "about_cred_icv": "National In-Country Value Certified (ICV).",
      "about_cred_oracle": "Certified Oracle Partner & Academic Partnership with the American University in the Emirates (AUE).",
      "lead_quote_tag": "Executive Leadership Message",
      "lead_quote_body": "\"We founded Solutions Castle to be the comprehensive strategic and technical partner for organizations; our objective transcends isolated fixes to deliver genuine integration between developing human talent and engineering intelligent systems—creating measurable return on investment and sustainable operational excellence for our partners.\"",
      "lead_quote_role": "Executive Leadership",
      "timeline_eyebrow": "Regional Growth Timeline",
      "timeline_title": "Our Expansion Across the Region",
      "tl_2019_title": "2019 — Launch in Riyadh",
      "tl_2019_desc": "Inception in the Kingdom of Saudi Arabia, establishing enterprise training partnerships and institutional solutions.",
      "tl_2023_title": "2023 — UAE Headquarters",
      "tl_2023_desc": "Securing the KHDA license and opening the headquarters in Dubai (Sheikh Zayed Road) to serve the UAE and GCC market.",
      "tl_egypt_title": "Regional Reach — Egypt",
      "tl_egypt_desc": "Launching operations and regional representative office to provide technical competencies, engineering, and operational support across the region.",
      "vm_vision_tag": "Our Vision",
      "vm_vision_title": "Leadership in Institutional Enablement & Digital Transformation.",
      "vm_vision_desc": "To be the most trusted partner in the GCC and Middle East bridging the gap between strategy and execution, empowering organizations to lead digital transformation effectively and sustainably.",
      "vm_mission_tag": "Our Mission",
      "vm_mission_title": "Building Competencies & Engineering Sustainable Solutions.",
      "vm_mission_desc": "Empowering institutions and personnel through a dual ecosystem uniting accredited training programs with artificial intelligence applications and cloud systems—translating knowledge into exceptional operational performance.",
      "why_eyebrow": "Why Partner With Us",
      "why_title": "Three Pillars of Distinctive Value",
      "why_p1_title": "Integration of Human & Technology",
      "why_p1_desc": "The single entity providing both IT systems deployment and workforce enablement under one unified roof.",
      "why_p2_title": "Governmental & Academic Accreditation",
      "why_p2_desc": "Officially certified programs supporting career pathways and granting preferential priority in tenders via our ICV certification.",
      "why_p3_title": "Elite Consultants & Experts",
      "why_p3_desc": "Over 20 certified advisors and specialists possessing extensive on-the-ground field experience in the Gulf business ecosystem.",
      "about_cta_box_title": "Ready to elevate your organization's performance and build a successful partnership?",
      "about_cta_primary": "Book a Strategic Discussion",
      "about_cta_secondary": "Connect via WhatsApp",

      // ── IT Services Page ──
      "it_hero_eyebrow": "IT Solutions & Intelligent Automation",
      "it_h1": "Building Smart Infrastructure for Your Organization and Driving Your Digital Transformation with Professionalism.",
      "it_sub": "Certified partner for enterprise systems development, AI agents, and workflow automation for businesses and government entities.",
      "it_cta_primary": "Book a Technical Consultation",
      "it_cta_secondary": "Explore Products & Solutions",
      "it_cred_oracle": "Certified Oracle Partner (Oracle Partner).",
      "it_cred_cloud": "Proven expertise in enterprise cloud implementation and advanced infrastructure.",
      "it_pillars_eyebrow": "01 Technical Solution Pillars",
      "it_pillars_title": "The Four Pillars of Intelligent Systems",
      "it_pillars_lead": "A comprehensive engineering ecosystem covering the entire lifecycle of automation, data, cloud, and cybersecurity.",
      "p1_title": "AI & Process Automation",
      "p1_point1": "<b>Department AI Agents:</b> Engineering specialized AI agents for each department (Sales, Customer Service, Finance, HR) executing complete workflows rather than simple chat.",
      "p1_point2": "<b>Robotic Process Automation (RPA):</b> Document processing, cross-system automated data entry, and streamlined approval workflows.",
      "p2_title": "Enterprise ERP & Core Systems",
      "p2_point1": "Configuring and customizing Enterprise Resource Planning (ERP) systems and Oracle ecosystem integrations.",
      "p2_point2": "Connecting Sales, Inventory, and Accounting into a centralized unified database that eliminates redundant manual entry.",
      "p3_title": "Cybersecurity & Governance",
      "p3_point1": "Comprehensive Penetration Testing and proactive Vulnerability Assessment (VAPT).",
      "p3_point2": "Security Operations Center (SOC) management and policy alignment with international standards (ISO 27001).",
      "p4_title": "Cloud & Infrastructure",
      "p4_point1": "Designing secure cloud migration roadmaps (Azure & AWS) and managing enterprise workplace environments (M365).",
      "p4_point2": "Ensuring business continuity and reducing waste in infrastructure and operational costs.",
      "enable_eyebrow": "Post-IT Implementation Enablement",
      "enable_title": "Systems alone are not enough.. We ensure total adoption of your software upon deployment",
      "enable_step1_num": "01 // SUPPLY",
      "enable_step1_txt": "Procuring, deploying, and calibrating software systems or AI departmental agents.",
      "enable_step2_num": "02 // TRAINING",
      "enable_step2_txt": "Training functional teams through KHDA-licensed programs to ensure skilled operational mastery.",
      "enable_step3_num": "03 // ADOPTION",
      "enable_step3_txt": "Achieving maximum Return on Investment (ROI) and eliminating employee resistance to change.",
      "tech_form_title": "Let us assess your infrastructure needs and automation options",
      "tech_form_sub": "Submit your project requirements and our technical consultants will respond within 1 business day.",
      "form_lbl_name": "Full Name",
      "form_lbl_org": "Organization / Company & Job Title",
      "form_lbl_phone": "Phone / WhatsApp (with country code)",
      "form_lbl_email": "Professional Work Email",
      "form_lbl_service": "Required Service",
      "form_lbl_msg": "Project Requirements Description",
      "form_opt_default": "Select requested service...",
      "form_opt_ai": "AI Agents & Workflow Automation",
      "form_opt_erp": "Enterprise ERP Systems",
      "form_opt_cyber": "Cybersecurity & ISO 27001",
      "form_opt_cloud": "Cloud Architecture & Migration",
      "form_submit_tech": "Submit Technical Consultation Request",

      // ── Training Page ──
      "tr_hero_eyebrow": "Workforce Capability & Certified Training",
      "tr_h1": "Certified Training and Professional Development Solutions Creating Measurable Impact.",
      "tr_sub": "Over 80 licensed training programs engineered to bridge the gap between academic theory and practical execution in the UAE and Gulf job markets.",
      "tr_cta_primary": "Download Training Catalog",
      "tr_cta_secondary": "Request Corporate Training Proposal",
      "tr_cred_khda": "Knowledge and Human Development Authority (KHDA) Dubai Govt License.",
      "tr_cred_cpd": "International Continuing Professional Development (CPD) Accreditation.",
      "tr_cred_aue": "Executive Diplomas Academic Partnership with American University in the Emirates (AUE).",
      "tr_cred_stanford": "Stanford Professional Training Partnership.",
      "df_eyebrow": "01 Delivery Formats",
      "df_title": "Flexible Training & Enablement Formats",
      "df_lead": "Total flexibility in delivery formats to fit enterprise teams, senior executives, and individual professionals.",
      "df_b2b_title": "Custom Corporate Training (B2B In-House)",
      "df_b2b_desc": "Customized programs tailored to your direct workplace challenges, delivered on-site at your premises or virtually.",
      "df_b2b_cta": "Request Corporate Proposal",
      "df_vip_title": "Executive 1-on-1 Coaching (1-on-1 VIP)",
      "df_vip_desc": "Exclusive private coaching for senior executives at our Dubai headquarters (Sheikh Zayed Road), with flexible scheduling.",
      "df_vip_cta": "Reserve 1-on-1 VIP Seat",
      "df_pub_title": "Public Professional Calendar (Public Calendar)",
      "df_pub_desc": "Open workshops and bootcamps for professionals seeking accredited certifications to accelerate career advancement.",
      "df_pub_cta": "Browse Calendar",
      "cat_eyebrow": "02 Interactive Catalog",
      "cat_title": "Training Programs & Professional Pathways",
      "cat_tab_1": "Management & Strategic Leadership",
      "cat_tab_2": "Accounting & Finance",
      "cat_tab_3": "AI & Technology",
      "cat_p1_title": "Transformation leadership, human resources management, and performance evaluation systems.",
      "cat_p2_title": "IFRS standards application, strategic budgeting, and corporate tax accounting.",
      "cat_p3_title": "AI for Business, Certified Ethical Hacker (CEH), and Power BI Data Analytics.",
      "cat_badge_khda": "KHDA Accredited",
      "cat_badge_cpd": "CPD Certified",
      "cat_badge_aue": "AUE Partner",
      "cat_badge_stanford": "Stanford Partner",
      "cat_empty_notice": "Official course syllabi and batch schedules are customized based on enterprise readiness assessment. Request the official curriculum via the form below.",
      "cat_cta_enroll": "Request Details & Enroll",
      "method_eyebrow": "03 Training Methodology",
      "method_title": "4-Stage Instructional Progression",
      "method_s1_title": "01 Assessment",
      "method_s1_desc": "Studying training needs and identifying field capability gaps for the professional or company.",
      "method_s2_title": "02 Design",
      "method_s2_desc": "Building instructional materials directly around the client's operational objectives.",
      "method_s3_title": "03 Execution",
      "method_s3_desc": "Case studies, practical simulations, and real-world applications away from dry theories.",
      "method_s4_title": "04 Evaluation",
      "method_s4_desc": "Measuring post-program impact and providing advisory guidance to guarantee practical application.",
      "icv_badge": "Governmental Competitive Advantage",
      "icv_title": "Maximizing Tender Evaluation Points via ICV",
      "icv_desc": "How training programs issued by an entity holding the National In-Country Value (ICV) certificate directly enhance company evaluation scores in government and semi-government tenders.",
      "trial_badge": "Try-Before-You-Buy Offer",
      "trial_time": "60 Minutes",
      "trial_title": "Complimentary Trial Workshop For Your Company",
      "trial_desc": "To evaluate training quality and instructor methodology before finalizing workforce contracts.",
      "tr_form_title": "Design the Optimal Training Pathway for You or Your Team",
      "tr_form_lbl_type": "Requested Program Type",
      "tr_opt_b2b": "Corporate B2B In-House",
      "tr_opt_vip": "Executive 1-on-1 VIP",
      "tr_opt_ind": "Specific Individual Professional Course",
      "tr_form_submit": "Confirm Training Consultation Request",

      // ── Contact Page ──
      "contact_hero_eyebrow": "Partnership & Contact Center",
      "contact_h1": "Contact Us to Elevate Your Institutional Efficiency and Lead Your Digital Transformation.",
      "contact_sub": "Whether you are seeking accredited training programs for your teams or need a consultation to architect AI systems and workflow automation, our advisors are ready to deliver the right solutions.",
      "contact_form_title": "Send an Inquiry or Consultation Request",
      "contact_form_sub": "Fill out the form and our advisory team will reach out within 1 business day.",
      "c_lbl_category": "Service Track / Area of Interest",
      "c_opt_training": "Workforce Training & Capability Development",
      "c_opt_it": "Information Technology & AI Solutions",
      "c_hub_dubai_title": "UAE Headquarters (Dubai)",
      "c_hub_dubai_addr": "Dubai, Sheikh Zayed Road, United Arab Emirates",
      "c_hub_riyadh_title": "Saudi Arabia Office (Riyadh)",
      "c_hub_riyadh_addr": "Riyadh, Kingdom of Saudi Arabia",
      "c_hub_email_title": "Unified Email",
      "c_hub_wa_title": "Direct WhatsApp Channel",
      "c_hub_wa_desc": "Instant WhatsApp chat with corporate client service for rapid enterprise inquiries.",
      "c_hub_wa_btn": "Instant Customer Service Chat",
      "c_phone_placeholder": "[ Official Phone — Under Scheduled Update ]",
      "map_eyebrow": "REGIONAL PRESENCE · UAE • KSA • EGYPT",
      "map_title": "Regional Presence & Headquarters Map",
      "map_hq_title": "Headquarters: Dubai — Sheikh Zayed Road",
      "map_hq_desc": "Ready for live coordinates via Google Maps API. For on-site meetings, please arrange a scheduled appointment through the consultation form.",
      "faq_eyebrow": "FREQUENTLY ASKED QUESTIONS",
      "faq_title": "Frequently Asked Questions",
      "faq_q1": "Are the training programs officially accredited?",
      "faq_a1": "Yes, all our courses and certificates are licensed and attested by the Knowledge and Human Development Authority — Government of Dubai (KHDA) and accredited under the Continuing Professional Development (CPD) system.",
      "faq_q2": "Do you offer training services at the client's premises?",
      "faq_a2": "Yes, we provide custom B2B programs conducted either at your company premises, at our headquarters, or virtually online.",
      "faq_q3": "How does the IT and AI consultation process begin?",
      "faq_a3": "An exploratory discovery session is organized to inspect existing infrastructure and identify automation opportunities prior to drafting technical and commercial proposals.",
      "contact_submit": "Submit Request",
      "feedback_success": "Thank you for reaching out. Your request has been received and our consultant will contact you within 1 business day."
    },

    ar: {
      // ── Header & Navigation ──
      "nav_home": "الرئيسية",
      "nav_about": "من نحن",
      "nav_it": "خدمات الـ IT",
      "nav_training": "التدريب والتطوير",
      "nav_industries": "القطاعات",
      "nav_contact": "تواصل معنا",
      "nav_cta": "تواصل معنا",
      "nav_tagline": "IT · TRAINING · AI",
      "menu_eyebrow": "Solutions Castle",
      "menu_foot": "IT Services & Training",
      "menu_cta": "طلب استشارة فورية",
      "sla_badge": "نلتزم بالرد وتقديم العروض المخصصة خلال يوم عمل واحد",

      // ── Footer ──
      "footer_tagline": "المنظومة المتكاملة للتمكين المؤسسي والتحول الرقمي المستدام في الإمارات والسعودية ومصر.",
      "footer_quick_links": "روابط سريعة",
      "footer_credentials": "الاعتمادات والشراكات",
      "footer_khda": "ترخيص KHDA حكومة دبي",
      "footer_cpd": "اعتماد CPD الدولي",
      "footer_icv": "شهادة القيمة الوطنية ICV",
      "footer_oracle": "شريك Oracle المعتمد",
      "footer_hubs": "المقرات الإقليمية",
      "footer_hub_dubai": "دبي — شارع الشيخ زايد",
      "footer_hub_riyadh": "الرياض — المملكة العربية السعودية",
      "footer_hub_cairo": "القاهرة — جمهورية مصر العربية",
      "footer_copy": "© 2026 Solutions Castle. جميع الحقوق محفوظة.",
      "footer_legal": "مرخص من هيئة المعرفة والتنمية البشرية (KHDA)",

      // ── Landing Page (Section 01 to 10) ──
      "hero_eyebrow": "سوليوشنز كاسل // خدمات الـ IT والتدريب",
      "hero_title_1": "بناء",
      "hero_title_2": "الكفاءات.",
      "hero_lede": "تقدم سوليوشنز كاسل خدمات تقنية معلومات وتدريباً مهنياً هندسياً لمساعدة المؤسسات على بناء بنية تقنية قوية وكفاءات بشرية متمكنة.",
      "hero_cta_talk": "تواصل معنا",
      "hero_cta_explore": "استكشف الخدمات",
      "hero_meta_services": "خدمات الـ IT",
      "hero_meta_training": "التدريب",

      "who_eyebrow": "01 من نحن",
      "who_title": "من<br />نحن",
      "who_lead": "تأسست سوليوشنز كاسل انطلاقاً من مبدأ راسخ: التقنية لا تصنع قيمة حقيقية إلا عندما يمتلك الكادر البشري الثقة والمهارة لتشغيلها باحتراف.",
      "who_stmt_1_title": "هندسة التنفيذ",
      "who_stmt_1_desc": "أنظمة مصممة ومنفذة ومدعومة بانضباط هندسي كامل.",
      "who_stmt_2_title": "التمكين البشري",
      "who_stmt_2_desc": "تدريب عملي يحول فرق العمل إلى مشغلين خبراء وليس مجرد متفرجين.",
      "who_stmt_3_title": "شراكة مستدامة",
      "who_stmt_3_desc": "نستمر معكم بعد الإطلاق؛ فهناك تتضاعف القيمة وتستقر الأنظمة.",

      "what_eyebrow": "02 ماذا نقدم",
      "what_title": "ماذا<br />نقدم",
      "what_lead": "قدرتان مترابطتان صُممتا لتعزيز وتدعيم بعضهما البعض.",
      "fork_name_a": "خدمات الـ<br />IT",
      "fork_desc_a": "البنية التحتية، السحابة، الأمن السيبراني، والدعم الفني — تدار كمنظومة واحدة.",
      "fork_name_b": "التد&shy;ريب",
      "fork_desc_b": "برامج عملية تصنع كفاءات تشغيلية حقيقية.",

      "it_eyebrow": "03 خدمات الـ IT",
      "it_title": "خدمات الـ<br />IT",
      "it_lead": "تنفيذ تقني شامل دون تجزئة. نصمم ونبني وندير بيئات العمل المؤسسية ذات الأداء الفائق.",
      "it_idx_1_title": "البنية التحتية للـ IT",
      "it_idx_1_desc": "الأنظمة المركزية، الخوادم، التخزين، والشبكات المصممة للمرونة والاستدامة.",
      "it_idx_2_title": "السحابة والأنظمة",
      "it_idx_2_desc": "الترحيل السحابي، البيئات الهجينة، ومنصات التشغيل المؤسسية الحديثة.",
      "it_idx_3_title": "الأمن السيبراني",
      "it_idx_3_desc": "التحصين الرقمي، المراقبة الاستباقية، والحماية المدمجة في أساسات النظام.",
      "it_idx_4_title": "الشبكات والاتصالات",
      "it_idx_4_desc": "اتصال فائق السرعة وموثوق يربط الفروع والمقار التشغيلية.",
      "it_idx_5_title": "الدعم الفني المتخصص",
      "it_idx_5_desc": "إدارة استباقية، استجابة سريعة، وصيانة مجدولة متعددة المستويات.",
      "it_idx_6_title": "الحلول الرقمية",
      "it_idx_6_desc": "بيئات وتطبيقات مخصصة وتكاملات آلية تدعم سير الأعمال.",
      "it_explore_cta": "استكشف خدمات تقنية المعلومات",

      "training_eyebrow": "04 التدريب والتطوير",
      "training_title": "التد&shy;ريب",
      "training_lead": "التمكين العملي أولاً. ورش عمل ومعسكرات يقودها خبراء ميدانيون لصناعة ممارسين محترفين.",
      "tr_idx_1_title": "التدريب التقني المتقدم",
      "tr_idx_1_desc": "مختبرات عملية في الأنظمة، الشبكات، السحابة، والأمن السيبراني.",
      "tr_idx_2_title": "التطوير المهني المؤسسي",
      "tr_idx_2_desc": "مسارات تقدم مهيكلة لفرق الهندسة والتشغيل وإدارة المشاريع.",
      "tr_idx_3_title": "تسريع المهارات التقنية",
      "tr_idx_3_desc": "تأهيل وظيفي سريع لتبني المعايير التقنية الحديثة بكفاءة.",
      "tr_idx_4_title": "التعلم الميداني التطبيقي",
      "tr_idx_4_desc": "تدريب مبني على محاكاة بيئات العمل المعقدة ودراسات الحالة الواقعية.",
      "tr_idx_5_title": "بناء القدرات المستدامة",
      "tr_idx_5_desc": "تحول مهاري طويل الأمد متوافق بدقة مع الأهداف الاستراتيجية للمنشأة.",
      "tr_explore_cta": "استكشف برامج التدريب",

      "how_eyebrow": "05 منهجية العمل",
      "how_title": "كيف<br />نعمل",
      "how_lead": "نموذج عمل منظم ومرحلي يضمن دقة التنفيذ وتحقيق نتائج تشغيلية ملموسة.",
      "stage_1_name": "الاستكشاف",
      "stage_1_desc": "فهم دقيق للبيئة التقنية، المحددات، والاحتياجات الفعلية.",
      "stage_2_name": "التخطيط",
      "stage_2_desc": "هندسة الحل، الجداول الزمنية، ومراحل نقل المعرفة.",
      "stage_3_name": "البناء",
      "stage_3_desc": "تركيب الأنظمة، تنفيذ التدريب، والربط المؤسسي باحتراف.",
      "stage_4_name": "التحسين",
      "stage_4_desc": "ضبط الأداء، تحصين الأمان، وترسيخ أفضل الممارسات التشغيلية.",
      "stage_5_name": "الدعم",
      "stage_5_desc": "استمرارية الصيانة، تحديث المهارات، وضمان الاستقرار الدائم.",

      "ind_eyebrow": "06 القطاعات المستهدفة",
      "ind_title": "القطا&shy;عات",
      "ind_lead": "خبرة متراكمة في تقديم الخدمات التقنية والبرامج التدريبية عبر قطاعات حيوية متعددة.",
      "ind_1": "المؤسسات والشركات",
      "ind_2": "الجهات الحكومية",
      "ind_3": "قطاع التعليم",
      "ind_4": "الرعاية الصحية",
      "ind_5": "القطاع المالي",
      "ind_6": "الخدمات اللوجستية",
      "ind_7": "الضيافة والسياحة",
      "ind_8": "الطاقة والبنية التحتية",

      "conn_eyebrow": "07 التكامل المؤسسي",
      "conn_title": "الترابط<br />المتكامل",
      "conn_lead": "الخدمات تبني البنية التحتية، والتدريب يُمكّن الكوادر. معاً يصنعان الاستقلال والتميز التشغيلي.",
      "conn_label_l": "خدمات الـ IT",
      "conn_label_r": "التدريب",

      "dest_eyebrow": "08 مساران متكاملان",
      "dest_lead": "نقطتا انطلاق.. لمنظومة عمل واحدة ومترابطة.",
      "gate_1_title": "خدمات الـ<br />IT",
      "gate_1_desc": "ابدأ بتقييم البنية التحتية لمنشأتك.",
      "gate_1_go": "نظرة عامة",
      "gate_2_title": "التد&shy;ريب",
      "gate_2_desc": "ابدأ بتقييم احتياجات فريقك التدريبية.",
      "gate_2_go": "نظرة عامة",
      "gates_note": "نقطتا انطلاق.. لمنظومة عمل واحدة ومترابطة.",

      "fin_eyebrow": "09 سوليوشنز كاسل",
      "fin_title_1": "لنبنِ معاً",
      "fin_title_2": "المستقبل.",
      "fin_cta": "تواصل معنا",

      // ── About Us Page ──
      "about_eyebrow": "سوليوشنز كاسل // نبذة عنا",
      "about_h1": "شريكك المتكامل للتمكين المؤسسي والتحول الرقمي المستدام.",
      "about_sub": "تأسست سوليوشنز كاسل كمنظومة متكاملة تدمج بين التدريب المهني المرخص وتطوير الحلول البرمجية الذكية لخدمة الشركات والجهات الحكومية عبر الإمارات والسعودية ومصر.",
      "about_cred_khda": "مرخص من هيئة المعرفة والتنمية البشرية بحكومة دبي (KHDA).",
      "about_cred_cpd": "معتمد للتطوير المهني المستمر الدولي (CPD).",
      "about_cred_icv": "حاصل على شهادة القيمة الوطنية المضافة (ICV).",
      "about_cred_oracle": "شريك أوراكل المعتمد والشراكة الأكاديمية مع الجامعة الأمريكية في الإمارات (AUE).",
      "lead_quote_tag": "رسالة الإدارة التنفيذية",
      "lead_quote_body": "\"أسسنا سوليوشنز كاسل لنكون الشريك الاستراتيجي والتقني المتكامل للمؤسسات؛ هدفنا تجاوز الحلول المنفصلة والدمج الحقيقي بين تأهيل الكوادر البشرية وهندسة الأنظمة الذكية، لنصنع لشركائنا عائداً استثمارياً قابلاً للقياس وتفوقاً تشغيلياً مستداماً\".",
      "lead_quote_role": "الإدارة التنفيذية",
      "timeline_eyebrow": "محطات التوسع الإقليمي",
      "timeline_title": "مسيرة النمو عبر المنطقة",
      "tl_2019_title": "الانطلاق في الرياض 2019",
      "tl_2019_desc": "التأسيس في المملكة العربية السعودية وبناء شراكات التدريب والحلول المؤسسية.",
      "tl_2023_title": "التوسع في دولة الإمارات 2023",
      "tl_2023_desc": "الحصول على ترخيص KHDA وافتتاح المقر الرئيسي في دبي (شارع الشيخ زايد) لخدمة السوق الإماراتي والخليجي.",
      "tl_egypt_title": "الانتشار الإقليمي - جمهورية مصر العربية",
      "tl_egypt_desc": "إطلاق العمليات والمكتب التمثيلي لتوفير الكفاءات والدعم الفني والتشغيلي لعملاء المنطقة.",
      "vm_vision_tag": "رؤيتنا",
      "vm_vision_title": "الريادة في التمكين المؤسسي والتحول الرقمي.",
      "vm_vision_desc": "أن نكون الشريك الأكثر موثوقية في منطقة الخليج والشرق الأوسط لسد الفجوة بين الاستراتيجية والتنفيذ، وتمكين المؤسسات من قيادة التحول الرقمي بفاعلية واستدامة.",
      "vm_mission_tag": "رسالتنا",
      "vm_mission_title": "بناء الكفاءات وهندسة الحلول المستدامة.",
      "vm_mission_desc": "تمكين المؤسسات والكوادر من خلال منظومة مزدوجة تجمع بين البرامج التدريبية المعتمدة وتطبيقات الذكاء الاصطناعي والأنظمة السحابية، لترجمة المعرفة إلى أداء تشغيلي استثنائي.",
      "why_eyebrow": "لماذا تختارنا",
      "why_title": "ثلاث ركائز تصنع الفارق لشركائنا",
      "why_p1_title": "التكامل بين الإنسان والتقنية",
      "why_p1_desc": "الكيان الوحيد الذي يوفر توريد الأنظمة (IT) وتأهيل فرق العمل لاستخدامها تحت سقف واحد.",
      "why_p2_title": "الاعتمادية الحكومية والأكاديمية",
      "why_p2_desc": "برامج موثقة رسميًا تدعم المسار الوظيفي وتمنح أولوية تفضيلية في المناقصات عبر شهادة الـ ICV.",
      "why_p3_title": "فريق خبراء واستشاريين",
      "why_p3_desc": "أكثر من 20 مستشاراً وخبيراً معتمداً يمتلكون خبرة ميدانية واسعة في بيئة الأعمال الخليجية.",
      "about_cta_box_title": "جاهز للارتقاء بأداء مؤسستك وفريق عملك وبناء شراكة عمل ناجحة؟",
      "about_cta_primary": "احجز جلسة نقاش استراتيجية",
      "about_cta_secondary": "تواصل معنا عبر واتساب",

      // ── IT Services Page ──
      "it_hero_eyebrow": "سوليوشنز كاسل // حلول تقنية المعلومات والأتمتة",
      "it_h1": "نبني البنية التحتية الذكية لمؤسستك ونقود تحولك الرقمي باحترافية.",
      "it_sub": "شريك معتمد لتطوير الأنظمة المؤسسية، وكلاء الذكاء الاصطناعي، وأتمتة العمليات لقطاع الأعمال والجهات الحكومية.",
      "it_cta_primary": "احجز جلسة استشارة تقنية",
      "it_cta_secondary": "استكشف المنتجات والحلول",
      "it_cred_oracle": "شريك أوراكل المعتمد (Oracle Partner).",
      "it_cred_cloud": "خبرات تطبيق الأنظمة السحابية وهندسة البنية التحتية المتقدمة.",
      "it_pillars_eyebrow": "01 محاور الحلول التقنية",
      "it_pillars_title": "الركائز الأربع للأنظمة الذكية",
      "it_pillars_lead": "منظومة هندسية متكاملة تغطي دورة حياة الأتمتة، البيانات، السحابة، والحماية السيبرانية.",
      "p1_title": "الذكاء الاصطناعي وأتمتة العمليات",
      "p1_point1": "<b>وكلاء الأقسام Department Agents:</b> بناء AI Agents متخصصة لكل قسم (المبيعات، خدمة العملاء، المالية، الموارد البشرية) لتنفيذ دورة العمل كاملة وليس مجرد محادثة.",
      "p1_point2": "<b>أتمتة المهام الروتينية (RPA):</b> معالجة المستندات، إدخال البيانات المتبادلة بين الأنظمة، وسير الموافقات الآلية.",
      "p2_title": "أنظمة المؤسسات والتكامل",
      "p2_point1": "تهيئة وتخصيص أنظمة تخطيط الموارد (ERP) وربط منظومة أوراكل.",
      "p2_point2": "ربط إدارة المبيعات، المخزون، والمحاسبة في قاعدة بيانات مركزية موحدة تمنع تكرار الإدخال اليدوي.",
      "p3_title": "الأمن السيبراني والامتثال",
      "p3_point1": "اختبارات الاختراق الشاملة وكشف الثغرات الاستباقي (VAPT).",
      "p3_point2": "إدارة مركز العمليات الأمنية (SOC) ومواءمة السياسات مع معايير الأمان الدولية (ISO 27001).",
      "p4_title": "السحابة والبنية التحتية",
      "p4_point1": "تصميم خرائط الترحيل السحابي الآمن (Azure & AWS) وإدارة بيئات العمل المؤسسية (M365).",
      "p4_point2": "ضمان استمرارية الأعمال وخفض الهدر في تكاليف البنية التحتية والتشغيل.",
      "enable_eyebrow": "تمكين ما بعد التركيب",
      "enable_title": "الأنظمة وحدها لا تكفي.. نضمن التبني التام لبرمجياتك فور تركيبها",
      "enable_step1_num": "01 // التوريد والتهيئة",
      "enable_step1_txt": "توريد وضبط الأنظمة البرمجية أو وكلاء الذكاء الاصطناعي.",
      "enable_step2_num": "02 // التدريب المعتمد",
      "enable_step2_txt": "تدريب الكوادر الوظيفية عبر برامج تدريبية مرخصة من KHDA لضمان تشغيل النظام بمهارة.",
      "enable_step3_num": "03 // التبني والعائد",
      "enable_step3_txt": "تحقيق أعلى عائد استثماري (ROI) وتصفير مقاومة التغيير بين الموظفين.",
      "tech_form_title": "دعنا نقيّم احتياجات بنيتك التحتية وخيارات الأتمتة المناسبة لمؤسستك",
      "tech_form_sub": "املأ تفاصيل متطلبات مشروعك وسيقوم مستشارونا التقنيون بالتواصل معك خلال يوم عمل واحد.",
      "form_lbl_name": "الاسم الكامل",
      "form_lbl_org": "اسم المنشأة / الشركة والمسمى الوظيفي",
      "form_lbl_phone": "رقم الهاتف / واتساب للتواصل السريع",
      "form_lbl_email": "البريد الإلكتروني المهني",
      "form_lbl_service": "الخدمة المطلوبة",
      "form_lbl_msg": "مساحة لوصف متطلبات المشروع الحالية",
      "form_opt_default": "اختر الخدمة المطلوبة...",
      "form_opt_ai": "وكلاء ذكاء اصطناعي وأتمتة",
      "form_opt_erp": "نظام ERP",
      "form_opt_cyber": "أمن سيبراني",
      "form_opt_cloud": "بنية سحابية",
      "form_submit_tech": "إرسال طلب الاستشارة التقنية",

      // ── Training Page ──
      "tr_hero_eyebrow": "سوليوشنز كاسل // برامج التدريب وبناء القدرات",
      "tr_h1": "حلول وخدمات تدريب وتطوير مهني معتمدة تصنع أثراً قابلاً للقياس.",
      "tr_sub": "أكثر من 80 برنامجاً تدريبياً مرخصاً ومصمماً لسد الفجوة بين المعرفة الأكاديمية والتطبيق الميداني في سوق العمل الإماراتي والخليجي.",
      "tr_cta_primary": "تحميل دليل البرامج التدريبية",
      "tr_cta_secondary": "طلب عرض تدريب مؤسسي",
      "tr_cred_khda": "ترخيص هيئة المعرفة والتنمية البشرية بحكومة دبي (KHDA).",
      "tr_cred_cpd": "اعتماد التطوير المهني المستمر الدولي (CPD).",
      "tr_cred_aue": "شراكة الدبلومات التنفيذية مع الجامعة الأمريكية في الإمارات (AUE).",
      "tr_cred_stanford": "شراكة جامعة ستانفورد للتدريب المهني (STANFORD).",
      "df_eyebrow": "01 نماذج التنفيذ",
      "df_title": "صيغ التدريب والتمكين",
      "df_lead": "مرونة تامة في آليات التدريب لتلائم متطلبات الشركات، القيادات التنفيذية، والكوادر المهنية.",
      "df_b2b_title": "التدريب المخصص للشركات (B2B In-House)",
      "df_b2b_desc": "تصميم برامج تلائم بيئة عملك وتحديات مؤسستك المباشرة، تُنفذ في مقر شركتكم أو افتراضياً.",
      "df_b2b_cta": "طلب عرض مخصص للشركات",
      "df_vip_title": "التدريب الفردي التنفيذي (1-on-1 VIP)",
      "df_vip_desc": "تدريب خاص وحصري لكبار المدراء والتنفيذيين بمقرنا الرئيسي بشارع الشيخ زايد بدبي، بمرونة كاملة تلائم جدول أعمالك.",
      "df_vip_cta": "حجز مقعد VIP فردي",
      "df_pub_title": "البرامج المهنية العامة (Public Calendar)",
      "df_pub_desc": "ورش عمل ومعسكرات مفتوحة للأفراد والمحترفين الراغبين في نيل شهادات معتمدة تعزز ترقيهم الوظيفي.",
      "df_pub_cta": "تصفح الجدول الزمني",
      "cat_eyebrow": "02 الدليل التدريبي",
      "cat_title": "المسارات والبرامج التدريبية",
      "cat_tab_1": "الإدارة والقيادة الاستراتيجية",
      "cat_tab_2": "المحاسبة والمالية",
      "cat_tab_3": "الذكاء الاصطناعي والتكنولوجيا",
      "cat_p1_title": "برامج قيادة التحول، إدارة الموارد البشرية، وأنظمة تقييم الأداء.",
      "cat_p2_title": "تطبيقات معايير IFRS، إعداد الموازنات الاستراتيجية، وحسابات الضريبة.",
      "cat_p3_title": "الذكاء الاصطناعي للأعمال AI for Business، الأمن السيبراني CEH، وتحليل البيانات Power BI.",
      "cat_badge_khda": "اعتماد KHDA",
      "cat_badge_cpd": "اعتماد CPD",
      "cat_badge_aue": "شراكة AUE",
      "cat_badge_stanford": "شراكة STANFORD",
      "cat_empty_notice": "الحقائب التدريبية والجداول التفصيلية يتم تصميمها خصيصاً بناءً على تقييم جاهزية المنشأة. لطلب المنهج المعتمد يرجى تعبئة النموذج أدناه.",
      "cat_cta_enroll": "طلب التفاصيل والالتحاق",
      "method_eyebrow": "03 منهجية التدريب",
      "method_title": "المراحل الأربع لبناء الكفاءات",
      "method_s1_title": "01 التقييم والتشخيص",
      "method_s1_desc": "دراسة الاحتياج التدريبي والفجوة الميدانية لدى المتدرب أو الشركة.",
      "method_s2_title": "02 التصميم المخصص",
      "method_s2_desc": "بناء الحقيبة التدريبية حول الأهداف التشغيلية للعميل.",
      "method_s3_title": "03 التنفيذ العملي",
      "method_s3_desc": "دراسات حالة، محاكاة عملية، وتطبيقات واقعية بعيداً عن النظريات الجافة.",
      "method_s4_title": "04 القياس والأثر",
      "method_s4_desc": "قياس الأثر بعد البرنامج وتقديم إرشادات استشارية لضمان التطبيق الفعلي.",
      "icv_badge": "أفضلية تفضيلية في المناقصات",
      "icv_title": "القيمة المضافة للمؤسسات (ICV)",
      "icv_desc": "كيف تساهم برامج التدريب الصادرة من منشأة حاصلة على شهادة القيمة الوطنية المضافة (ICV) في رفع نقاط تقييم الشركات في المناقصات الحكومية وشبه الحكومية.",
      "trial_badge": "عرض تجريبي مجاني",
      "trial_time": "60 دقيقة",
      "trial_title": "ورشة عمل تجريبية مجانية لشركتكم (Try-Before-You-Buy)",
      "trial_desc": "لفحص كفاءة التدريب ومنهجية المدرب قبل توقيع عقود تدريب فرق العمل.",
      "tr_form_title": "صمم المسار التدريبي الأنسب لك أو لفريقك",
      "tr_form_lbl_type": "نوع البرنامج المطلوب",
      "tr_opt_b2b": "مؤسسي B2B",
      "tr_opt_vip": "فردي VIP",
      "tr_opt_ind": "دورة محددة للأفراد",
      "tr_form_submit": "تأكيد طلب الاستشارة التدريبية",

      // ── Contact Page ──
      "contact_hero_eyebrow": "مركز التواصل والشراكات المؤسسية",
      "contact_h1": "تواصل معنا لنرتقي بكفاءة مؤسستك ونقود تحولك الرقمي.",
      "contact_sub": "سواء كنت تبحث عن برامج تدريبية معتمدة لفرق عملك، أو ترغب في استشارة لبناء أنظمة الذكاء الاصطناعي وأتمتة العمليات، مستشارونا مستعدون للإجابة وتقديم الحلول المناسبة.",
      "contact_form_title": "إرسال طلب استشارة أو استفسار",
      "contact_form_sub": "املأ النموذج وسيقوم فريق الاستشاريين بالتواصل معك خلال يوم عمل واحد.",
      "c_lbl_category": "الخدمة المطلوبة / مسار الاهتمام",
      "c_opt_training": "حلول التدريب وتطوير الكوادر",
      "c_opt_it": "حلول تقنية المعلومات والذكاء الاصطناعي",
      "c_hub_dubai_title": "المقر الرئيسي في دولة الإمارات (دبي)",
      "c_hub_dubai_addr": "دبي، شارع الشيخ زايد، دولة الإمارات العربية المتحدة",
      "c_hub_riyadh_title": "مكتب المملكة العربية السعودية (الرياض)",
      "c_hub_riyadh_addr": "الرياض، المملكة العربية السعودية",
      "c_hub_email_title": "البريد الإلكتروني الموحد",
      "c_hub_wa_title": "محادثة واتساب فورية",
      "c_hub_wa_desc": "محادثة واتساب فورية مع خدمة العملاء لخدمة الاستفسارات السريعة لقطاع الأعمال.",
      "c_hub_wa_btn": "محادثة فورية مع خدمة العملاء",
      "c_phone_placeholder": "[ الهاتف المعتمد — قيد التحديث الرسمي ]",
      "map_eyebrow": "REGIONAL PRESENCE · UAE • KSA • EGYPT",
      "map_title": "خريطة التواجد الإقليمي والمقرات الرئيسية",
      "map_hq_title": "المقر الرئيسي: دبي — شارع الشيخ زايد",
      "map_hq_desc": "جاهز لربط الإحداثيات المباشرة فور تفعيل موقع المقر عبر Google Maps API. للتواصل الميداني يرجى حجز موعد مسبق عبر نموذج الاستشارة.",
      "faq_eyebrow": "FREQUENTLY ASKED QUESTIONS",
      "faq_title": "الأسئلة الشائعة",
      "faq_q1": "هل البرامج التدريبية معتمدة رسمياً؟",
      "faq_a1": "نعم، كافة دوراتنا وشهاداتنا مرخصة ومصدقة من هيئة المعرفة والتنمية البشرية بحكومة دبي (KHDA) ومعتمدة بنظام التطوير المهني المستمر (CPD).",
      "faq_q2": "هل تقدمون خدمات التدريب داخل مقر العميل؟",
      "faq_a2": "نعم، نقدم برامج B2B مخصصة تُنفذ إما داخل مقر شركتكم، أو بمقرنا، أو عبر الإنترنت.",
      "faq_q3": "كيف تبدأ عملية استشارة الـ IT والذكاء الاصطناعي؟",
      "faq_a3": "يتم تنظيم جلسة استكشافية لفحص البنية التحتية وتحديد فرص الأتمتة قبل صياغة العرض الفني والتجاري.",
      "contact_submit": "إرسال الطلب",
      "feedback_success": "شكراً لتواصلك. تم استلام طلبك بنجاح وسيتواصل معك مستشارنا خلال يوم عمل واحد."
    }
  };

  // ── Language State & Helper Engine ──
  const STORAGE_KEY = 'sc_lang';

  function getSavedLanguage() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qLang = urlParams.get('lang');
      if (qLang === 'ar' || qLang === 'en') return qLang;
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') return stored;
    } catch (_) {}
    return 'en'; // Default is English
  }

  function applyLanguage(lang) {
    const isAr = lang === 'ar';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // 1. Set HTML root attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    // 2. Update all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        // If element contains HTML markup (like <br /> or <b>), use innerHTML
        if (dict[key].includes('<') || dict[key].includes('&')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // 3. Update input placeholders with data-i18n-placeholder
    const phElements = document.querySelectorAll('[data-i18n-ph]');
    phElements.forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 4. Update language switcher button UI
    const langSwitchers = document.querySelectorAll('.lang-switch');
    langSwitchers.forEach(sw => {
      const enBtn = sw.querySelector('.lang-btn--en');
      const arBtn = sw.querySelector('.lang-btn--ar');
      if (enBtn) enBtn.classList.toggle('is-active', !isAr);
      if (arBtn) arBtn.classList.toggle('is-active', isAr);
      sw.setAttribute('aria-label', isAr ? 'Switch to English' : 'التغيير إلى العربية');
    });

    // 5. Update Document Title
    const titleKey = document.body.dataset.pageTitleKey;
    if (titleKey && dict[titleKey]) {
      document.title = dict[titleKey];
    }

    // 6. Notify subsystems (e.g. fitText on landing page or sliders)
    window.dispatchEvent(new CustomEvent('sc:languageChanged', { detail: { lang, isAr } }));
  }

  function setLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
    applyLanguage(lang);
  }

  function toggleLanguage() {
    const current = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const next = current === 'ar' ? 'en' : 'ar';
    setLanguage(next);
  }

  // ── Global Initializer ──
  function initI18n() {
    const initialLang = getSavedLanguage();
    applyLanguage(initialLang);

    // Attach click listeners to language switchers
    document.addEventListener('click', e => {
      const sw = e.target.closest('.lang-switch');
      if (sw) {
        e.preventDefault();
        const explicitBtn = e.target.closest('[data-lang]');
        if (explicitBtn && explicitBtn.dataset.lang) {
          setLanguage(explicitBtn.dataset.lang);
        } else {
          toggleLanguage();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }

  // Expose global API
  window.__SC_I18N = {
    getLanguage: () => document.documentElement.lang || 'en',
    setLanguage,
    toggleLanguage,
    t: (key, lang) => (TRANSLATIONS[lang || document.documentElement.lang] || TRANSLATIONS.en)[key] || key
  };
})();
