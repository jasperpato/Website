import { ReactNode, useEffect, useRef, useState } from "react";
import { Columns2, Earth, Globe, Mail, Rows2 } from "lucide-react";
import IconButton, { IconSize } from "../../components/IconButton";
import aoeLogo from "../../assets/aoe.svg";
import icrarLogo from "../../assets/icrar.png";
import uwaLogo from "../../assets/uwa.png";
import cfcLogo from "../../assets/cfc.jpeg";

const MM_TO_PX = 96 / 25.4;
const PAGE_WIDTH_PX = 210 * MM_TO_PX;
const PAGE_HEIGHT_PX = 297 * MM_TO_PX;
const OUTER_PADDING_PX = 64; // matches p-8 on both sides

const iconSize = "w-[0.9em] h-[0.9em]"

export default function Resume() {
    // const [stacked, setStacked] = useState(false);
    const stacked = true;

    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateScale = () => {
            const available = el.clientWidth - OUTER_PADDING_PX;
            setScale(Math.min(1, available / PAGE_WIDTH_PX));
        };

        updateScale();

        const resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, []);

    function SubHeading({ children, className = "" }: { children: ReactNode, className?: string }) {
        return <h3 className={`text-primary font-bold text-lg ${className}`}>{children}</h3>
    }

    function Td({ children = "", header = false, className = "", semibold = false, fit = false, fill = false, right = false }: { right?: boolean, children?: ReactNode, header?: boolean, className?: string, fit?: boolean, fill?: boolean, semibold?: boolean }) {
        return <td className={`align-top ${fit ? "w-[1%] whitespace-nowrap" : ""} ${fill ? "w-full" : ""} ${right ? "text-right" : ""} ${header ? "font-bold text-right" : ""} ${semibold ? "font-semibold" : ""} ${className}`}>{children}</td>
    }

    function Section({ title, children, className = "" }: { title?: string, children: ReactNode, className?: string }) {
        return <>
            <div className={`w-full flex flex-col items-start gap-2 ${className}`}>
                {title && <SubHeading>{title}</SubHeading>}

                <div className="flex flex-col gap-6 w-full">
                    {children}
                </div>
            </div>
        </>
    }

    function Table({ children, className = "", wide = false }: { children: ReactNode, className?: string, wide?: boolean }) {
        return <table className={`${wide ? "[&_td:not(:last-child)]:pr-12" : "[&_td:not(:last-child)]:pr-6"} [&_tr:not(:last-child)_td]:pb-3 ${className}`}>
            <tbody>{children}</tbody>
        </table>
    }

    function P({ children }: { children: ReactNode }) {
        return <p className="w-full text-justify">{children}</p>
    }

    function ExperienceSection({ title, date, children = "", icon, link }: { icon?: string, link?: string, title: string, date: string, children?: ReactNode }) {
        const i = <>{icon && <img src={icon} alt="" className={`${iconSize} object-contain shrink-0`} />}</>

        return <>
            <div className="flex flex-col gap-2">
                <Table>
                    <tr>
                        <Td fill className="font-bold">
                            <div className="flex items-center gap-2 leading-none">
                                {link ? <A href={link}>{i}</A> : i}
                                <span>{title}</span>
                            </div>
                        </Td>
                        <Td fit semibold>{date}</Td>
                    </tr>
                </Table>

                {children}
            </div>
        </>
    }

    function A({ children, href }: { children: ReactNode, href: string }) {
        return <a target="_blank" rel="noopener noreferrer" href={href} className="group inline-flex items-center gap-2 leading-none text-none hover:text-secondary">
            {children}
        </a>
    }

    // inlined (rather than referencing the .svg assets, which have hardcoded fill colors) so they can use currentColor and follow hover:text-secondary
    function GithubIcon({ className = "" }: { className?: string }) {
        return <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
        </svg>
    }

    function LinkedinIcon({ className = "" }: { className?: string }) {
        return <svg viewBox="0 0 382 382" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889 C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056 H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806 c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1 s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73 c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079 c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426 c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472 L341.91,330.654L341.91,330.654z" />
        </svg>
    }

    function Page({ children }: { children: ReactNode }) {
        return <div className="w-[210mm] h-[297mm] p-[0.8in] bg-bg">
            <div className="flex flex-col gap-6 bg-bg h-full overflow-hidden">
                {children}
            </div>
        </div>
    }

    function List({ children, color = "black" }: { children: ReactNode, color?: string }) {
        return <ul className="list-disc pl-4.5 marker:text-[var(--marker-color)]" style={{ "--marker-color": color } as React.CSSProperties}>{children}</ul>
    }

    return <>
        <div ref={containerRef} className={`p-8 flex ${stacked ? "flex-col items-center" : "flex-row"} justify-center gap-8 bg-border relative`}>
            <div style={{ width: PAGE_WIDTH_PX * scale, height: PAGE_HEIGHT_PX * scale }}>
                <div style={{ width: PAGE_WIDTH_PX, height: PAGE_HEIGHT_PX, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                    <Page>
                        <p className="text-2xl font-semibold">Jasper Paterson<span className="px-3">•</span>Full Stack Software Engineer</p>

                        {/* <Section title="Personal Details"> */}
                        <Section className="pt-2">
                            <Table wide className="w-fit">
                                <tr>
                                    <Td><A href="mailto:jasperpato@gmail.com"><Mail className={iconSize}/>jasperpato@gmail.com</A></Td>
                                    <Td><A href="https://github.com/jasperpato/"><GithubIcon className={iconSize}/>github.com/jasperpato</A></Td>
                                </tr>
                                <tr>
                                    <Td><A href="https://jasperpato.com/"><Globe className={iconSize}/>jasperpato.com</A></Td>
                                    <Td><A href="https://www.linkedin.com/in/jasper-paterson-798b1317b"><LinkedinIcon className={`${iconSize} text-[#0077B5] group-hover:text-secondary`}/>linkedin.com/in/jasper-paterson-798b1317b</A></Td>
                                </tr>
                            </Table>
                        </Section>

                        <Section title="About Me">
                            <P>
                                Tennis player, full stack engineer, love physics, short story
                            </P>
                        </Section>

                        <Section title="Education">
                            <Table className="w-fit">
                                <tr>
                                    <Td header fit>Undergrad</Td>
                                    <Td>UWA Bachelor of Science in Engineering Science and Computer Science</Td>
                                    <Td fit right>WAM<br />GPA</Td>
                                    <Td fit>86.0<br />6.91</Td>
                                    <Td fit right semibold>2019 - 2021</Td>
                                </tr>
                                <tr>
                                    <Td header fit>Postgrad</Td>
                                    <Td>UWA Master of Professional Engineering (Software Specialisation)</Td>
                                    <Td fit right>WAM<br />GPA</Td>
                                    <Td fit>85.9<br />7.00</Td>
                                    <Td fit right semibold>2022 - 2024</Td>
                                </tr>
                            </Table>
                        </Section>

                        <Section title="Experience">
                            <ExperienceSection
                                // colors={["var(--color-aurora-blue)", "var(--color-aurora-light-blue)"]}
                                // color="var(--color-aurora-blue)"
                                icon={aoeLogo}
                                link="https://aurora-oe.com/"
                                title="Aurora Offshore Engineering"
                                date="January 2025 - Present"
                            >
                                <List color="var(--color-uwa-blue)">
                                    <li><A href="https://ceed.wa.edu.au/">CEED</A> research project</li>
                                    <li>efficient Python programs using Pandas, NumPy and SciPy.</li>
                                    <li>I also created an internal web application using React.js,
                                        Django, Celery and Docker deployed on Microsoft Azure at <A href="https://auroracat.app/">auroracat.app</A></li>
                                    <li>Maintain internal and client-facing desktop app deployments using Kotlin Multiplatform Compose.</li>
                                    <li>Azure Container Apps, PostgreSQL, Functions, DNS Zones, Front Door</li>
                                </List>
                            </ExperienceSection>

                            <ExperienceSection
                                // color="var(--color-icrar-red)"
                                icon={icrarLogo}
                                link="https://icrar.org/"
                                title="ICRAR Studentship"
                                date="Nov 2023 - Feb 2024"
                            >
                                <List color="var(--color-icrar-red)">
                                    <li>Joined the Commensal Real-time
                                        ASKAP Fast Transients (CRAFT) Survey team researching Fast Radio Bursts
                                        (FRBs)</li>
                                    <li>Researched leading theories on the progenitors of FRBs</li>
                                    <li>Python data processing and statistical analysis of FRB burst profiles and host galaxy data</li>
                                </List>
                            </ExperienceSection>

                            <ExperienceSection
                                // color="black"
                                icon={cfcLogo}
                                link="https://www.codersforcauses.org/"
                                title="Coders for Causes"
                                date="Jun 2023 - Jul 2023"
                            >
                                <List>
                                    <li>Volunteered for the winter project working full stack</li>
                                </List>
                            </ExperienceSection>

                            <ExperienceSection
                                icon={uwaLogo}
                                link="https://uwa.edu.au/"
                                title="UWA Lab Demonstrator"
                                date="Feb 2022 - Oct 2024"
                            >
                                <div className="flex flex-row gap-8">
                                    <List color="var(--color-uwa-gold)">
                                        <li>Computational Thinking in Python</li>
                                        <li>Graphics and Animation</li>
                                        <li>Systems Programming</li>
                                    </List>

                                    <List color="var(--color-uwa-gold)">
                                        <li>Computer Networks</li>
                                        <li>Secure Coding</li>
                                        <li>Three awards for excellence in teaching</li>
                                    </List>
                                </div>
                            </ExperienceSection>
                        </Section>
                    </Page>
                </div>
            </div>
        </div>
    </>
}