export default function Layout({children}: {children: React.ReactNode}) {
    return(
        <section>
            Sólo para el new account:
            {children}
        </section>
    )
}