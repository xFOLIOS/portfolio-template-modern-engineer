import {
	Activity,
	ArrowRight,
	Award,
	BarChart3,
	BookOpen,
	Briefcase,
	CheckCircle,
	ChevronDown,
	Cloud,
	Code2,
	Database,
	GraduationCap,
	Layers,
	Mail,
	MapPin,
	Menu,
	Phone,
	Server,
	Shield,
	Star,
	Target,
	Trophy,
	Workflow,
	Wrench,
	X,
	Zap,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

/* =============================================================
   SECTION: Icon resolution shim
   ---------------------------------------------------------------
   The original template component (copied from the frontend
   editor) expects icons as live ReactNode props (e.g. <Cloud />).
   But this repo's ONLY data source is a static JSON file, and
   JSON cannot carry a React element. Savy's backend mapper
   (toModernEngineerData) currently omits icon/color fields
   entirely for several sections.

   This shim lets each icon-bearing field be either:
     - a real ReactNode (if a future mapper version does pass one)
     - a plain string key (e.g. "cloud") looked up below
     - undefined (mapper doesn't send one yet)
   and always resolves to something renderable, cycling through
   sensible defaults so the UI never shows a blank icon slot.

   >>> This is a deliberate, minimal deviation from "copy the
   >>> template as-is" made necessary by the JSON contract.
   >>> Flag to Savy: consider adding string icon keys + color
   >>> classes to toModernEngineerData() so this shim can shrink.
   ============================================================= */

type IconLike = ReactNode | string | undefined;

const ICON_MAP: Record<string, ReactNode> = {
	activity: <Activity className="w-6 h-6" />,
	award: <Award className="w-6 h-6" />,
	barchart3: <BarChart3 className="w-6 h-6" />,
	briefcase: <Briefcase className="w-6 h-6" />,
	cloud: <Cloud className="w-6 h-6" />,
	code2: <Code2 className="w-6 h-6" />,
	database: <Database className="w-6 h-6" />,
	graduationcap: <GraduationCap className="w-6 h-6" />,
	layers: <Layers className="w-6 h-6" />,
	mail: <Mail className="w-6 h-6" />,
	mappin: <MapPin className="w-6 h-6" />,
	phone: <Phone className="w-6 h-6" />,
	server: <Server className="w-6 h-6" />,
	shield: <Shield className="w-6 h-6" />,
	star: <Star className="w-6 h-6" />,
	target: <Target className="w-6 h-6" />,
	trophy: <Trophy className="w-6 h-6" />,
	workflow: <Workflow className="w-6 h-6" />,
	wrench: <Wrench className="w-6 h-6" />,
	zap: <Zap className="w-6 h-6" />,
};

function resolveIcon(icon: IconLike, fallback: ReactNode): ReactNode {
	if (typeof icon === "string") {
		return ICON_MAP[icon.toLowerCase()] ?? fallback;
	}
	if (icon) return icon;
	return fallback;
}

function pick<T>(cycle: T[], idx: number): T {
	return cycle[idx % cycle.length];
}

const SKILL_ICON_CYCLE: ReactNode[] = [
	<Code2 key="code2" className="w-6 h-6" />,
	<Layers key="layers" className="w-6 h-6" />,
	<Database key="database" className="w-6 h-6" />,
	<Cloud key="cloud" className="w-6 h-6" />,
	<Server key="server" className="w-6 h-6" />,
	<Wrench key="wrench" className="w-6 h-6" />,
];
const SKILL_COLOR_CYCLE = [
	"from-blue-500 to-cyan-500",
	"from-violet-500 to-fuchsia-500",
	"from-orange-500 to-red-500",
	"from-cyan-500 to-teal-500",
	"from-emerald-500 to-green-500",
	"from-amber-500 to-orange-500",
];

const PROJECT_ICON_CYCLE: ReactNode[] = [
	<Workflow key="workflow" className="w-10 h-10" />,
	<Database key="database" className="w-10 h-10" />,
	<Activity key="activity" className="w-10 h-10" />,
	<Cloud key="cloud" className="w-10 h-10" />,
];
const PROJECT_GRADIENT_CYCLE = [
	"from-blue-600 to-cyan-600",
	"from-violet-600 to-fuchsia-600",
	"from-orange-600 to-red-600",
	"from-emerald-600 to-teal-600",
];
const PROJECT_ACCENT_CYCLE = ["blue", "purple", "orange", "emerald"];

const CERT_ICON_CYCLE: ReactNode[] = [
	<Award key="award" className="w-8 h-8" />,
	<Shield key="shield" className="w-8 h-8" />,
	<Server key="server" className="w-8 h-8" />,
	<Cloud key="cloud" className="w-8 h-8" />,
];
const CERT_COLOR_CYCLE = [
	"from-amber-500 to-orange-600",
	"from-blue-500 to-indigo-600",
	"from-emerald-500 to-teal-600",
];
const CERT_BADGE_CYCLE = [
	"bg-amber-500/10 text-amber-400 border-amber-500/20",
	"bg-blue-500/10 text-blue-400 border-blue-500/20",
	"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
];

const ACHIEVEMENT_ICON_CYCLE: ReactNode[] = [
	<Trophy key="trophy" className="w-7 h-7" />,
	<Award key="award" className="w-7 h-7" />,
	<Target key="target" className="w-7 h-7" />,
	<Star key="star" className="w-7 h-7" />,
];
const ACHIEVEMENT_COLOR_CYCLE = [
	"from-yellow-500 to-amber-600",
	"from-violet-500 to-fuchsia-600",
	"from-blue-500 to-cyan-600",
	"from-emerald-500 to-teal-600",
];

const CONTACT_COLOR_CYCLE = [
	"from-violet-500 to-violet-700",
	"from-emerald-500 to-teal-600",
	"from-orange-500 to-red-600",
];

function contactIconFallback(label?: string): ReactNode {
	const key = (label ?? "").toLowerCase();
	if (key.includes("email")) return <Mail className="w-6 h-6" />;
	if (key.includes("phone")) return <Phone className="w-6 h-6" />;
	if (key.includes("location")) return <MapPin className="w-6 h-6" />;
	return <Mail className="w-6 h-6" />;
}

/* =============================================================
   SECTION: Types — everything lives inside PortfolioData
   so the preview host can pass ONE prop: portfolioData.
   ============================================================= */

export type NavItem = { label: string; href: string };

export type SkillCategory = {
	category: string;
	icon?: IconLike;
	color?: string;
	skills: string[];
};

export type Project = {
	title: string;
	description: string;
	tags: string[];
	icon?: IconLike;
	gradient?: string;
	accent?: string;
};

export type Experience = {
	company: string;
	role: string;
	duration: string;
	location: string;
	achievements: string[];
};

export type Certification = {
	title: string;
	issuer: string;
	date: string;
	icon?: IconLike;
	color?: string;
	badgeColor?: string;
};

export type Achievement = {
	title: string;
	description: string;
	icon?: IconLike;
	color?: string;
};

export type ContactMethod = {
	icon?: IconLike;
	label: string;
	value: string;
	href: string;
	color?: string;
};

export type EducationCourse = string;

export type EducationInfo = {
	degree: string;
	institution: string;
	field: string;
	location: string;
	description: string;
	year: string;
	yearLabel: string;
	coursework: EducationCourse[];
};

export type HeroInfo = {
	badge: string;
	greeting: string;
	name: string;
	roleIcon?: IconLike;
	role: string;
	description: string;
	ctaLabel: string;
	ctaHref: string;
	monogram: string;
	monogramTagline: string;
	floatBadgeTop?: { icon?: IconLike; label: string };
	floatBadgeBottom?: { icon?: IconLike; label: string };
};

export type AboutInfo = {
	subtitle: string;
	headingLead: string;
	headingHighlight: string;
	paragraphs: string[];
	/** Floating stat card — DO NOT redesign. */
	stat: { value: string; label: string };
};

export type BrandInfo = {
	initial: string;
	name: string;
	suffix: string;
};

export type ContactSectionInfo = {
	subtitle: string;
	availabilityLabel: string;
	availabilityText: string;
};

/**
 * The single data contract used by the preview host.
 * Every section is optional — missing sections are hidden in real mode.
 */
export type PortfolioData = {
	brand?: BrandInfo;
	navItems?: NavItem[];
	hero?: HeroInfo;
	about?: AboutInfo;
	skills?: SkillCategory[];
	projects?: Project[];
	experiences?: Experience[];
	education?: EducationInfo;
	certifications?: Certification[];
	achievements?: Achievement[];
	contactMethods?: ContactMethod[];
	contactSection?: ContactSectionInfo;
	footerLinks?: string[];
	copyrightName?: string;
};

/**
 * Component props — single unified shape, matching the other templates.
 * The preview host can render every template with:
 *   <ModernEngineerTemplate portfolioData={portfolioData} />
 */
export type ModernEngineerTemplateProps = {
	portfolioData: PortfolioData;
};

/* =============================================================
   SECTION: Default Nav (used only as a fallback when the JSON
   doesn't supply navItems)
   ============================================================= */

export const DEFAULT_NAV_ITEMS: NavItem[] = [
	{ label: "Home", href: "#hero" },
	{ label: "About", href: "#about" },
	{ label: "Skills", href: "#skills" },
	{ label: "Projects", href: "#projects" },
	{ label: "Experience", href: "#experience" },
	{ label: "Education", href: "#education" },
	{ label: "Certifications", href: "#certifications" },
	{ label: "Achievements", href: "#achievements" },
	{ label: "Contact", href: "#contact" },
];

/* =============================================================
   SECTION: Intersection Observer Hook for Scroll Animations
   ============================================================= */
function useInView(threshold = 0.15) {
	const ref = useRef<HTMLDivElement>(null);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
				}
			},
			{ threshold },
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [threshold]);

	return { ref, isInView };
}

/* =============================================================
   SECTION: Reusable Sub-Components
   ============================================================= */

function SectionHeading({
	title,
	subtitle,
	light = false,
}: {
	title: string;
	subtitle: string;
	light?: boolean;
}) {
	return (
		<div className="text-center mb-16">
			<h2
				className={`text-4xl md:text-5xl font-bold mb-4 ${
					light ? "text-white" : "gradient-text"
				}`}
			>
				{title}
			</h2>
			<p
				className={`text-lg max-w-2xl mx-auto ${
					light ? "text-slate-400" : "text-slate-600"
				}`}
			>
				{subtitle}
			</p>
			<div className="mt-6 flex justify-center gap-1">
				<span className="w-3 h-1 rounded-full bg-violet-500" />
				<span className="w-8 h-1 rounded-full bg-violet-500" />
				<span className="w-3 h-1 rounded-full bg-violet-500" />
			</div>
		</div>
	);
}

function AnimatedSection({
	children,
	className = "",
	id,
}: {
	children: ReactNode;
	className?: string;
	id?: string;
}) {
	const { ref, isInView } = useInView(0.08);
	return (
		<div
			id={id}
			ref={ref}
			className={`transition-all duration-1000 ${
				isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
			} ${className}`}
		>
			{children}
		</div>
	);
}

/* =============================================================
   SECTION: Main Template Component
   — Single prop contract: { portfolioData }
   — No fallback/merge with DEFAULT_DATA. The host decides
     what data to pass; this file only fills in icons/colors
     the JSON contract can't carry (see shim above).
   ============================================================= */
export default function ModernEngineerTemplate({
	portfolioData,
}: ModernEngineerTemplateProps) {
	// Use exactly what the host passed. No per-field fallbacks.
	const brand = portfolioData.brand;
	const navItems = portfolioData.navItems;
	const hero = portfolioData.hero;
	const about = portfolioData.about;
	const skills = portfolioData.skills;
	const projects = portfolioData.projects;
	const experiences = portfolioData.experiences;
	const education = portfolioData.education;
	const certifications = portfolioData.certifications;
	const achievements = portfolioData.achievements;
	const contactMethods = portfolioData.contactMethods;
	const contactSection = portfolioData.contactSection;
	const footerLinks = portfolioData.footerLinks;
	const copyrightName = portfolioData.copyrightName;

	// Determine which sections actually have content.
	const hasHero = Boolean(hero);
	const hasAbout = Boolean(about);
	const hasSkills = Array.isArray(skills) && skills.length > 0;
	const hasProjects = Array.isArray(projects) && projects.length > 0;
	const hasExperience = Array.isArray(experiences) && experiences.length > 0;
	const hasEducation = Boolean(education);
	const hasCertifications =
		Array.isArray(certifications) && certifications.length > 0;
	const hasAchievements =
		Array.isArray(achievements) && achievements.length > 0;
	const hasContact =
		(Array.isArray(contactMethods) && contactMethods.length > 0) ||
		Boolean(contactSection);
	const hasFooter = Boolean(brand) || footerLinks?.length || copyrightName;

	const availableSectionIds = new Set<string>();
	if (hasHero) availableSectionIds.add("hero");
	if (hasAbout) availableSectionIds.add("about");
	if (hasSkills) availableSectionIds.add("skills");
	if (hasProjects) availableSectionIds.add("projects");
	if (hasExperience) availableSectionIds.add("experience");
	if (hasEducation) availableSectionIds.add("education");
	if (hasCertifications) availableSectionIds.add("certifications");
	if (hasAchievements) availableSectionIds.add("achievements");
	if (hasContact) availableSectionIds.add("contact");

	// Use provided nav items, but only link to sections that actually exist.
	// If none provided, derive nav items from the available sections.
	const visibleNavItems = navItems
		? navItems.filter((item) => availableSectionIds.has(item.href.slice(1)))
		: DEFAULT_NAV_ITEMS.filter((item) =>
				availableSectionIds.has(item.href.slice(1)),
			);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState("hero");

	useEffect(() => {
		if (visibleNavItems.length === 0) return;

		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
			const sections = visibleNavItems.map((item) => item.href.slice(1));
			for (let i = sections.length - 1; i >= 0; i--) {
				const el = document.getElementById(sections[i]);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= 120) {
						setActiveSection(sections[i]);
						break;
					}
				}
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [visibleNavItems]);

	return (
		<div className="min-h-screen bg-slate-950 text-white antialiased">
			{/* Navigation */}
			{(brand || visibleNavItems.length > 0) && (
				<nav
					className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
						scrolled
							? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-slate-950/50"
							: "bg-transparent"
					}`}
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 lg:h-20">
							{brand && (
								<a href="#hero" className="flex items-center gap-2 group">
									{brand.initial && (
										<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/50 transition-shadow duration-300">
											{brand.initial}
										</div>
									)}
									{(brand.name || brand.suffix) && (
										<span className="text-xl font-bold text-white hidden sm:block">
											{brand.name}
											{brand.suffix && (
												<span className="text-violet-400">{brand.suffix}</span>
											)}
										</span>
									)}
								</a>
							)}

							{visibleNavItems.length > 0 && (
								<div className="hidden lg:flex items-center gap-1">
									{visibleNavItems.map((item) => (
										<a
											key={item.href}
											href={item.href}
											className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
												activeSection === item.href.slice(1)
													? "text-violet-400 bg-violet-500/10"
													: "text-slate-400 hover:text-white hover:bg-slate-800/50"
											}`}
										>
											{item.label}
										</a>
									))}
								</div>
							)}

							{visibleNavItems.length > 0 && (
								<button
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
									className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
								>
									{mobileMenuOpen ? (
										<X className="w-6 h-6" />
									) : (
										<Menu className="w-6 h-6" />
									)}
								</button>
							)}
						</div>
					</div>

					{visibleNavItems.length > 0 && (
						<div
							className={`lg:hidden transition-all duration-300 overflow-hidden ${
								mobileMenuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
							}`}
						>
							<div className="bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 px-4 py-4 space-y-1">
								{visibleNavItems.map((item) => (
									<a
										key={item.href}
										href={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
											activeSection === item.href.slice(1)
												? "text-violet-400 bg-violet-500/10"
												: "text-slate-400 hover:text-white hover:bg-slate-800/50"
										}`}
									>
										{item.label}
									</a>
								))}
							</div>
						</div>
					)}
				</nav>
			)}

			{/* Hero */}
			{hero && (
				<section
					id="hero"
					className="relative min-h-screen flex items-center overflow-hidden"
				>
					<div className="absolute inset-0">
						<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-float" />
						<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-float animation-delay-200" />
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
						<div
							className="absolute inset-0 opacity-[0.03]"
							style={{
								backgroundImage:
									"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
								backgroundSize: "60px 60px",
							}}
						/>
					</div>

					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div className="space-y-8 animate-fade-in-up">
								{hero.badge && (
									<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
										<Zap className="w-4 h-4" />
										{hero.badge}
									</div>
								)}

								<div className="space-y-4">
									<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
										{hero.greeting}
										<span className="gradient-text">{hero.name}</span>
									</h1>
									<h2 className="text-2xl sm:text-3xl font-semibold text-slate-300 flex items-center gap-3">
										{resolveIcon(
											hero.roleIcon,
											<Code2 className="w-8 h-8 text-violet-400" />,
										)}
										{hero.role}
									</h2>
								</div>

								{hero.description && (
									<p className="text-lg text-slate-400 leading-relaxed max-w-xl">
										{hero.description}
									</p>
								)}

								{hero.ctaLabel && hero.ctaHref && (
									<div className="flex flex-wrap gap-4">
										<a
											href={hero.ctaHref}
											className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300"
										>
											<Mail className="w-5 h-5" />
											{hero.ctaLabel}
											<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
										</a>
									</div>
								)}
							</div>

							<div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-300">
								<div className="relative">
									<div className="absolute -inset-4 rounded-full border border-violet-500/20 animate-pulse-glow" />
									<div className="absolute -inset-8 rounded-full border border-violet-500/10" />
									<div className="absolute -inset-12 rounded-full border border-violet-500/5" />

									<div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-violet-500/30 shadow-2xl shadow-violet-500/20 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 flex items-center justify-center">
										<div className="text-center">
											<span className="text-8xl sm:text-9xl font-black text-white/90 leading-none tracking-tighter">
												{hero.monogram}
											</span>
											{hero.monogramTagline && (
												<div className="mt-2 text-sm font-medium text-white/60 tracking-[0.3em] uppercase">
													{hero.monogramTagline}
												</div>
											)}
										</div>
										<div
											className="absolute inset-0 opacity-10"
											style={{
												backgroundImage:
													"radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
												backgroundSize: "20px 20px",
											}}
										/>
									</div>

									{hero.floatBadgeTop && (
										<div className="absolute -top-2 -right-2 flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-white shadow-xl animate-float">
											{resolveIcon(
												hero.floatBadgeTop.icon,
												<Zap className="w-4 h-4 text-cyan-400" />,
											)}
											{hero.floatBadgeTop.label}
										</div>
									)}
									{hero.floatBadgeBottom && (
										<div className="absolute -bottom-2 -left-4 flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-white shadow-xl animate-float animation-delay-300">
											{resolveIcon(
												hero.floatBadgeBottom.icon,
												<Star className="w-4 h-4 text-emerald-400" />,
											)}
											{hero.floatBadgeBottom.label}
										</div>
									)}
								</div>
							</div>
						</div>

						{hasAbout && (
							<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
								<span className="text-xs tracking-widest uppercase">Scroll</span>
								<ChevronDown className="w-5 h-5" />
							</div>
						)}
					</div>
				</section>
			)}

			{/* About */}
			{about && (
				<section id="about" className="py-24 bg-slate-900/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading title="About Me" subtitle={about.subtitle} light />
						</AnimatedSection>

						<AnimatedSection>
							<div className="grid lg:grid-cols-2 gap-12 items-center">
								<div className="relative">
									<div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 bg-slate-900">
										<div className="aspect-video flex items-center justify-center p-6 sm:p-8">
											<div className="grid grid-cols-4 gap-3 w-full max-w-md">
												{Array.from({ length: 16 }).map((_, i) => {
													const heights = [
														40, 65, 85, 50, 75, 90, 45, 70, 60, 80, 95, 55,
														70, 85, 50, 75,
													];
													return (
														<div
															key={i}
															className="flex flex-col justify-end h-28"
														>
															<div
																className="rounded-t-xl bg-gradient-to-t from-violet-700 via-violet-500 to-blue-400 opacity-85 hover:opacity-100 transition-opacity duration-300"
																style={{ height: `${heights[i]}%` }}
															/>
														</div>
													);
												})}
											</div>
										</div>
									</div>
									{/* Floating stat card — DO NOT TOUCH */}
									{about.stat && (
										<div className="absolute -bottom-6 -right-4 sm:right-8 glass rounded-xl p-4 shadow-xl">
											<div className="flex items-center gap-3">
												<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
													<Zap className="w-6 h-6 text-white" />
												</div>
												<div>
													<div className="text-2xl font-bold text-white">
														{about.stat.value}
													</div>
													<div className="text-xs text-slate-400">
														{about.stat.label}
													</div>
												</div>
											</div>
										</div>
									)}
								</div>

								<div className="space-y-6">
									<h3 className="text-2xl font-bold text-white">
										{about.headingLead}
										<span className="gradient-text">
											{about.headingHighlight}
										</span>
									</h3>
									{about.paragraphs && about.paragraphs.length > 0 && (
										<div className="space-y-4 text-slate-400 leading-relaxed">
											{about.paragraphs.map((p, i) => (
												<p key={i}>{p}</p>
											))}
										</div>
									)}
								</div>
							</div>
						</AnimatedSection>
					</div>
				</section>
			)}

			{/* Skills */}
			{hasSkills && (
				<section id="skills" className="py-24 bg-slate-950">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading
								title="Technical Skills"
								subtitle="A comprehensive toolkit for modern engineering"
								light
							/>
						</AnimatedSection>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{skills.map((category, idx) => (
								<AnimatedSection key={category.category}>
									<div className="group relative p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl h-full">
										<div className="flex items-center gap-3 mb-6">
											<div
												className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
													category.color ?? pick(SKILL_COLOR_CYCLE, idx)
												} flex items-center justify-center text-white shadow-lg`}
											>
												{resolveIcon(
													category.icon,
													pick(SKILL_ICON_CYCLE, idx),
												)}
											</div>
											<h3 className="text-lg font-bold text-white">
												{category.category}
											</h3>
										</div>

										{category.skills && category.skills.length > 0 && (
											<div className="flex flex-wrap gap-2.5">
												{category.skills.map((skill) => (
													<span
														key={skill}
														className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 hover:scale-105 cursor-default bg-white/5 border-white/10 text-slate-300 hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/10"
													>
														<CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
														{skill}
													</span>
												))}
											</div>
										)}
									</div>
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Projects */}
			{hasProjects && (
				<section id="projects" className="py-24 bg-slate-900/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading
								title="Featured Projects"
								subtitle="Showcasing impactful engineering solutions"
								light
							/>
						</AnimatedSection>

						<div className="grid md:grid-cols-2 gap-8">
							{projects.map((project, idx) => (
								<AnimatedSection key={project.title}>
									<div className="group relative rounded-2xl overflow-hidden glass hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
										<div
											className={`relative h-48 bg-gradient-to-br ${
												project.gradient ?? pick(PROJECT_GRADIENT_CYCLE, idx)
											} flex items-center justify-center overflow-hidden`}
										>
											<div
												className="absolute inset-0 opacity-10"
												style={{
													backgroundImage:
														"radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)",
													backgroundSize: "24px 24px",
												}}
											/>
											<div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
											<div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />

											<div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-xl">
												{resolveIcon(
													project.icon,
													pick(PROJECT_ICON_CYCLE, idx),
												)}
											</div>

											<div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold text-white">
												0{idx + 1}
											</div>
										</div>

										<div className="p-6 space-y-4">
											<h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors duration-300">
												{project.title}
											</h3>
											<p className="text-sm text-slate-400 leading-relaxed">
												{project.description}
											</p>

											{project.tags && project.tags.length > 0 && (
												<div className="flex flex-wrap gap-2 pt-2">
													{project.tags.map((tag) => (
														<span
															key={tag}
															className="px-3 py-1 text-xs font-medium rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20"
														>
															{tag}
														</span>
													))}
												</div>
											)}
										</div>
									</div>
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Experience */}
			{hasExperience && (
				<section id="experience" className="py-24 bg-slate-950">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading
								title="Work Experience"
								subtitle="My professional journey"
								light
							/>
						</AnimatedSection>

						<div className="relative">
							<div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent" />

							<div className="space-y-12">
								{experiences.map((exp, idx) => (
									<AnimatedSection key={exp.company}>
										<div
											className={`relative flex flex-col lg:flex-row items-start gap-8 ${
												idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
											}`}
										>
											<div className="absolute left-8 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-violet-500 border-4 border-slate-950 shadow-lg shadow-violet-500/50 z-10" />
											<div className="hidden lg:block lg:w-1/2" />

											<div className="ml-16 lg:ml-0 lg:w-1/2">
												<div className="group p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02]">
													<div className="flex items-start gap-4 mb-4">
														<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white shadow-lg flex-shrink-0">
															<Briefcase className="w-6 h-6" />
														</div>
														<div>
															<h3 className="text-lg font-bold text-white">
																{exp.role}
															</h3>
															<p className="text-violet-400 font-medium">
																{exp.company}
															</p>
															<div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
																<span>{exp.duration}</span>
																{exp.location && (
																	<>
																		<span>•</span>
																		<span className="flex items-center gap-1">
																			<MapPin className="w-3 h-3" />
																			{exp.location}
																		</span>
																	</>
																)}
															</div>
														</div>
													</div>

													{exp.achievements && exp.achievements.length > 0 && (
														<ul className="space-y-2 ml-1">
															{exp.achievements.map((ach, aIdx) => (
																<li
																	key={aIdx}
																	className="flex items-start gap-2 text-sm text-slate-400"
																>
																	<CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
																	{ach}
																</li>
															))}
														</ul>
													)}
												</div>
											</div>
										</div>
									</AnimatedSection>
								))}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Education */}
			{education && (
				<section id="education" className="py-24 bg-slate-900/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading
								title="Education"
								subtitle="Academic foundation"
								light
							/>
						</AnimatedSection>

						<AnimatedSection>
							<div className="max-w-3xl mx-auto">
								<div className="group relative p-8 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02]">
									<div className="flex flex-col sm:flex-row items-start gap-6">
										<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white shadow-xl shadow-violet-500/25 flex-shrink-0">
											<GraduationCap className="w-10 h-10" />
										</div>

										<div className="space-y-3 flex-1">
											<div>
												<h3 className="text-2xl font-bold text-white">
													{education.degree}
												</h3>
												<p className="text-lg text-violet-400 font-semibold">
													{education.institution}
												</p>
											</div>
											<div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
												{education.field && (
													<span className="flex items-center gap-1.5">
														<BookOpen className="w-4 h-4 text-slate-500" />
														{education.field}
													</span>
												)}
												{education.location && (
													<span className="flex items-center gap-1.5">
														<MapPin className="w-4 h-4 text-slate-500" />
														{education.location}
													</span>
												)}
											</div>
											{education.description && (
												<p className="text-slate-400 leading-relaxed">
													{education.description}
												</p>
											)}

											{education.coursework && education.coursework.length > 0 && (
												<div className="pt-2">
													<p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
														Key Coursework
													</p>
													<div className="flex flex-wrap gap-2">
														{education.coursework.map((course) => (
															<span
																key={course}
																className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-400 border border-slate-700"
															>
																{course}
															</span>
														))}
													</div>
												</div>
											)}
										</div>

										{education.year && (
											<div className="absolute top-6 right-6 sm:static">
												<div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-center">
													<div className="text-xl">{education.year}</div>
													<div className="text-xs text-slate-500">
														{education.yearLabel}
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</AnimatedSection>
					</div>
				</section>
			)}

			{/* Certifications */}
			{hasCertifications && (
				<section id="certifications" className="py-24 bg-slate-950">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading
								title="Certifications"
								subtitle="Industry-recognized credentials"
								light
							/>
						</AnimatedSection>

						<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
							{certifications.map((cert, idx) => (
								<AnimatedSection key={cert.title}>
									<div className="group relative p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02] text-center">
										<div
											className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${
												cert.color ?? pick(CERT_COLOR_CYCLE, idx)
											} flex items-center justify-center text-white shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}
										>
											{resolveIcon(cert.icon, pick(CERT_ICON_CYCLE, idx))}
										</div>

										<h3 className="text-lg font-bold text-white mb-2">
											{cert.title}
										</h3>
										<p className="text-sm text-slate-400 mb-4">{cert.issuer}</p>

										<div
											className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
												cert.badgeColor ?? pick(CERT_BADGE_CYCLE, idx)
											}`}
										>
											<Award className="w-3.5 h-3.5" />
											Certified · {cert.date}
										</div>
									</div>
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Achievements */}
			{hasAchievements && (
				<section id="achievements" className="py-24 bg-slate-900/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading
								title="Achievements"
								subtitle="Milestones and recognitions"
								light
							/>
						</AnimatedSection>

						<div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
							{achievements.map((ach, idx) => (
								<AnimatedSection key={ach.title}>
									<div className="group relative p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02]">
										<div className="flex items-start gap-4">
											<div
												className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
													ach.color ?? pick(ACHIEVEMENT_COLOR_CYCLE, idx)
												} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
											>
												{resolveIcon(
													ach.icon,
													pick(ACHIEVEMENT_ICON_CYCLE, idx),
												)}
											</div>
											<div>
												<h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
													{ach.title}
												</h3>
												<p className="text-sm text-slate-400 leading-relaxed">
													{ach.description}
												</p>
											</div>
										</div>
									</div>
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Contact */}
			{hasContact && (
				<section id="contact" className="py-24 bg-slate-900/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<AnimatedSection>
							<SectionHeading
								title="Get In Touch"
								subtitle={contactSection?.subtitle ?? ""}
								light
							/>
						</AnimatedSection>

						<AnimatedSection>
							<div className="max-w-3xl mx-auto">
								{contactMethods && contactMethods.length > 0 && (
									<div className="grid sm:grid-cols-3 gap-6 mb-8">
										{contactMethods.map((c, idx) => (
											<a
												key={c.label}
												href={c.href}
												className="group p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02] text-center"
											>
												<div
													className={`mx-auto w-14 h-14 rounded-xl bg-gradient-to-br ${
														c.color ?? pick(CONTACT_COLOR_CYCLE, idx)
													} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
												>
													{resolveIcon(c.icon, contactIconFallback(c.label))}
												</div>
												<p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
													{c.label}
												</p>
												<p className="text-sm text-slate-300 font-medium">
													{c.value}
												</p>
											</a>
										))}
									</div>
								)}

								{contactSection && (
									<div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-900/20 border border-violet-500/20 text-center">
										<div className="flex items-center justify-center gap-3 mb-3">
											<div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
											<span className="text-sm font-semibold text-emerald-400">
												{contactSection.availabilityLabel}
											</span>
										</div>
										<p className="text-sm text-slate-400">
											{contactSection.availabilityText}
										</p>
									</div>
								)}
							</div>
						</AnimatedSection>
					</div>
				</section>
			)}

			{/* Footer */}
			{hasFooter && (
				<footer className="py-12 bg-slate-950 border-t border-slate-800/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex flex-col md:flex-row items-center justify-between gap-6">
							{brand && (
								<div className="flex items-center gap-2">
									{brand.initial && (
										<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-sm">
											{brand.initial}
										</div>
									)}
									{(brand.name || brand.suffix) && (
										<span className="text-lg font-bold text-white">
											{brand.name}
											{brand.suffix && (
												<span className="text-violet-400">{brand.suffix}</span>
											)}
										</span>
									)}
								</div>
							)}

							{footerLinks && footerLinks.length > 0 && (
								<div className="flex flex-wrap justify-center gap-6">
									{footerLinks.map((link) => (
										<a
											key={link}
											href={`#${link.toLowerCase()}`}
											className="text-sm text-slate-500 hover:text-violet-400 transition-colors"
										>
											{link}
										</a>
									))}
								</div>
							)}

							{copyrightName && (
								<p className="text-sm text-slate-600">
									© {new Date().getFullYear()} {copyrightName}. All rights
									reserved.
								</p>
							)}
						</div>
					</div>
				</footer>
			)}

			{/* Scroll to Top */}
			{scrolled && (
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-40"
					aria-label="Scroll to top"
				>
					<ChevronDown className="w-5 h-5 rotate-180" />
				</button>
			)}
		</div>
	);
}
