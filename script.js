document.addEventListener(
    "DOMContentLoaded",
    () => {

        initNavbar();

        initMobileMenu();

        initRevealAnimations();

        initProjectFilters();

        initProjectModal();

        initBackToTop();

        setCurrentYear();

    }
);


/* ========================================
   NAVBAR
======================================== */

function initNavbar() {

    const navbar =
        document.getElementById(
            "navbar"
        );


    if (!navbar) {

        return;
    }


    function updateNavbar() {

        navbar.classList.toggle(
            "is-scrolled",
            window.scrollY > 35
        );
    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );

}


/* ========================================
   MOBILE MENU
======================================== */

function initMobileMenu() {

    const toggle =
        document.getElementById(
            "navToggle"
        );


    const menu =
        document.getElementById(
            "mobileMenu"
        );


    if (!toggle || !menu) {

        return;
    }


    function openMenu() {

        menu.classList.add(
            "is-open"
        );


        toggle.classList.add(
            "is-active"
        );


        toggle.setAttribute(
            "aria-expanded",
            "true"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeMenu() {

        menu.classList.remove(
            "is-open"
        );


        toggle.classList.remove(
            "is-active"
        );


        toggle.setAttribute(
            "aria-expanded",
            "false"
        );


        document.body.style.overflow =
            "";

    }


    toggle.addEventListener(
        "click",
        () => {

            const open =
                menu.classList.contains(
                    "is-open"
                );


            if (open) {

                closeMenu();

            } else {

                openMenu();
            }

        }
    );


    document
        .querySelectorAll(
            ".mobile-menu__link"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );


    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                980
            ) {

                closeMenu();
            }

        }
    );

}


/* ========================================
   SCROLL REVEAL
======================================== */

function initRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        elements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );


        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add(
                                    "is-visible"
                                );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {

                threshold:
                    0.12,

                rootMargin:
                    "0px 0px -40px 0px"

            }
        );


    elements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/* ========================================
   PROJECT FILTERS
======================================== */

function initProjectFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    const projects =
        document.querySelectorAll(
            ".project-card"
        );


    if (
        !buttons.length ||
        !projects.length
    ) {

        return;
    }


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const filter =
                        button.dataset.filter;


                    buttons.forEach(
                        item => {

                            item.classList.remove(
                                "is-active"
                            );

                        }
                    );


                    button.classList.add(
                        "is-active"
                    );


                    projects.forEach(
                        project => {

                            const category =
                                project.dataset.category;


                            const show =
                                filter === "all" ||
                                category === filter;


                            project.classList.toggle(
                                "is-hidden",
                                !show
                            );

                        }
                    );

                }
            );

        }
    );

}


/* ========================================
   PROJECT DATA
======================================== */

const projectData = {


    fitlove: {

        number:
            "01",

        type:
            "Projeto pessoal",

        title:
            "FitLove",

        image:
            "imagens/fitlove.png",

        description:
            "Aplicação web voltada para organização e acompanhamento de treinos. O projeto apresenta treino do dia, progresso semanal, histórico, exercícios e uma experiência pensada principalmente para dispositivos móveis.",

        technologies: [

            "HTML5",
            "CSS3",
            "JavaScript",
            "LocalStorage",
            "Responsive Design"

        ],

        project:
            "https://mikaelbryan2008.github.io/FitLove/index.html",

        github:
            "https://github.com/MikaelBryan2008/FitLove"

    },


    voltz: {

        number:
            "02",

        type:
            "Projeto real",

        title:
            "VOLTZ3D",

        image:
            "imagens/voltz3d.png",

        description:
            "Interface web desenvolvida para a VOLTZ3D, marca voltada à impressão 3D e personalizados. O projeto apresenta a marca, categorias de produtos, trabalhos realizados, redes sociais e solicitação de orçamento.",

        technologies: [

            "HTML5",
            "CSS3",
            "JavaScript",
            "Responsive Design"

        ],

        project:
            "https://voltz3d.github.io/",

        github:
            "https://github.com/voltz3d/voltz3d.github.io"

    },


    lumera: {

        number:
            "03",

        type:
            "Projeto real",

        title:
            "Luméra",

        image:
            "imagens/lumera.png",

        description:
            "Interface digital criada para a Luméra, marca voltada a beleza e autocuidado. A página centraliza acesso à loja, Instagram, WhatsApp e informações institucionais da marca.",

        technologies: [

            "HTML5",
            "CSS3",
            "JavaScript",
            "Responsive Design"

        ],

        project:
            "https://usealumera.github.io/",

        github:
            "https://github.com/usealumera/usealumera.github.io"

    },


    powerfit: {

        number:
            "04",

        type:
            "Projeto de estudo",

        title:
            "PowerFit",

        image:
            "imagens/academia1.png",

        description:
            "Landing page desenvolvida para uma academia fictícia, com apresentação de planos, estrutura, depoimentos e chamada para matrícula.",

        technologies: [

            "HTML5",
            "CSS3",
            "JavaScript",
            "Responsive Design"

        ],

        project:
            "Academia/index.html",

        github:
            "#"

    },


    bellamassa: {

        number:
            "05",

        type:
            "Projeto de estudo",

        title:
            "Bella Massa",

        image:
            "imagens/restaurante1.png",

        description:
            "Website institucional desenvolvido para um restaurante italiano, apresentando cardápio, história, ambiente e informações para reservas.",

        technologies: [

            "HTML5",
            "CSS3",
            "JavaScript",
            "Responsive Design"

        ],

        project:
            "restaurante/index.html",

        github:
            "#"

    },


    royal: {

        number:
            "06",

        type:
            "Projeto de estudo",

        title:
            "Royal Barber",

        image:
            "imagens/barbearia1.png",

        description:
            "Landing page desenvolvida para uma barbearia premium, apresentando serviços, equipe, galeria e integração com WhatsApp para agendamentos.",

        technologies: [

            "HTML5",
            "CSS3",
            "JavaScript",
            "Responsive Design"

        ],

        project:
            "barbearia/index.html",

        github:
            "#"

    }

};


/* ========================================
   PROJECT MODAL
======================================== */

function initProjectModal() {

    const modal =
        document.getElementById(
            "projectModal"
        );


    if (!modal) {

        return;
    }


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const modalType =
        document.getElementById(
            "modalType"
        );


    const modalNumber =
        document.getElementById(
            "modalNumber"
        );


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    const modalDescription =
        document.getElementById(
            "modalDescription"
        );


    const modalTech =
        document.getElementById(
            "modalTech"
        );


    const modalProject =
        document.getElementById(
            "modalProject"
        );


    const modalGithub =
        document.getElementById(
            "modalGithub"
        );


    const modalClose =
        document.getElementById(
            "modalClose"
        );


    function openModal(
        projectKey
    ) {

        const project =
            projectData[
                projectKey
            ];


        if (!project) {

            return;
        }


        modalImage.src =
            project.image;


        modalImage.alt =
            `Preview do projeto ${project.title}`;


        modalType.textContent =
            project.type;


        modalNumber.textContent =
            project.number;


        modalTitle.textContent =
            project.title;


        modalDescription.textContent =
            project.description;


        modalTech.innerHTML =
            "";


        project.technologies
            .forEach(
                technology => {

                    const tag =
                        document.createElement(
                            "span"
                        );


                    tag.textContent =
                        technology;


                    modalTech.appendChild(
                        tag
                    );

                }
            );


        configureProjectLink(
            modalProject,
            project.project,
            "Ver projeto ↗"
        );


        configureProjectLink(
            modalGithub,
            project.github,
            "Ver código ↗"
        );


        modal.classList.add(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body
            .classList
            .add(
                "modal-open"
            );

    }


    function closeModal() {

        modal.classList.remove(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body
            .classList
            .remove(
                "modal-open"
            );

    }


    document
        .querySelectorAll(
            ".project-card"
        )
        .forEach(
            card => {

                const button =
                    card.querySelector(
                        ".project-card__click"
                    );


                if (!button) {

                    return;
                }


                button.addEventListener(
                    "click",
                    () => {

                        openModal(
                            card.dataset.project
                        );

                    }
                );

            }
        );


    modalClose.addEventListener(
        "click",
        closeModal
    );


    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    closeModal
                );

            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeModal();
            }

        }
    );

}


/* ========================================
   LINK CONFIGURATION
======================================== */

function configureProjectLink(
    element,
    url,
    text
) {

    element.textContent =
        text;


    if (
        !url ||
        url === "#"
    ) {

        element.style.display =
            "none";


        return;
    }


    element.style.display =
        "inline-flex";


    element.href =
        url;

}


/* ========================================
   BACK TO TOP
======================================== */

function initBackToTop() {

    const button =
        document.getElementById(
            "backToTop"
        );


    if (!button) {

        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top:
                    0,

                behavior:
                    "smooth"

            });

        }
    );

}


/* ========================================
   CURRENT YEAR
======================================== */

function setCurrentYear() {

    const element =
        document.getElementById(
            "currentYear"
        );


    if (!element) {

        return;
    }


    element.textContent =
        new Date()
            .getFullYear();

}