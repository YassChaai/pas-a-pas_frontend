export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 text-slate-700">
      <header className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Politique de confidentialité</p>
        <h1 className="text-3xl font-bold text-slate-900">Pas’à Pas</h1>
        <p className="text-sm text-slate-500">Dernière mise à jour : 22 septembre 2025</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          Chez <strong>Pas’à Pas</strong>, la protection de vos données personnelles est une priorité. Cette politique vous
          explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre
          plateforme e-commerce.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">1. Responsable du traitement</h2>
        <p>
          Le site <strong>Pas’à Pas</strong> est responsable du traitement des données collectées. Pour toute question relative à
          vos données, contactez-nous :
        </p>
        <p className="font-medium text-pasapas-blue">support@pas-a-pas.shop</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">2. Données que nous collectons</h2>
        <p>Nous collectons uniquement les informations nécessaires à la gestion de votre compte, de vos commandes et ventes :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Données de compte</strong> : prénom, nom, adresse e-mail, mot de passe chiffré.
          </li>
          <li>
            <strong>Informations de commande et livraison</strong> : adresse postale, numéro de téléphone, historique d’achats.
          </li>
          <li>
            <strong>Données vendeur</strong> : historique des ventes, solde de la cagnotte.
          </li>
          <li>
            <strong>Informations bancaires</strong> :
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Acheteurs : données de paiement transmises directement à <strong>Stripe</strong>. Nous n’avons jamais accès à votre
                numéro de carte.
              </li>
              <li>
                Vendeurs : RIB/IBAN chiffrés et transmis à <strong>Stripe</strong> pour les virements bancaires.
              </li>
            </ul>
          </li>
          <li>
            <strong>Données de navigation</strong> : cookies, adresse IP, préférences (avec votre consentement).
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">3. Utilisation de vos données</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Traiter commandes et livraisons.</li>
          <li>Gérer les paiements et sécuriser les transactions via <strong>Stripe</strong>.</li>
          <li>Alimenter et suivre la <strong>cagnotte vendeur</strong> et permettre le retrait des fonds.</li>
          <li>Envoyer des e-mails transactionnels (commande, expédition, suivi, notification de virement).</li>
          <li>Améliorer votre expérience utilisateur sur le site.</li>
          <li>Respecter nos obligations légales (facturation, comptabilité, lutte contre la fraude).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">4. Destinataires de vos données</h2>
        <p>Vos données ne sont <strong>jamais revendues</strong>. Elles sont partagées uniquement avec :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Stripe</strong> pour le traitement des paiements et des virements bancaires.</li>
          <li>Nos prestataires techniques (hébergement, e-mails transactionnels).</li>
          <li>Les transporteurs pour l’expédition de vos commandes.</li>
        </ul>
        <p>
          Stripe est conforme au <strong>RGPD</strong> et certifié PCI-DSS.
          <a className="ml-1 text-pasapas-blue underline" href="https://stripe.com/fr/privacy" target="_blank" rel="noreferrer">
            Politique de confidentialité Stripe
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">5. Durée de conservation</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Données de compte : tant que votre compte est actif.</li>
          <li>Données de commande : jusqu’à 3 ans (obligations légales).</li>
          <li>Données liées aux paiements et à la cagnotte : 5 ans.</li>
          <li>Cookies : 13 mois maximum.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">6. Cookies</h2>
        <p>
          Nous utilisons des cookies pour assurer le fonctionnement du panier et de la session, analyser la fréquentation et
          améliorer l’expérience utilisateur.
        </p>
        <p>
          Vous pouvez accepter ou refuser les cookies via le bandeau affiché lors de votre première visite et modifier vos
          préférences à tout moment.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">7. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez des droits d’accès, rectification, effacement, opposition, limitation et
          portabilité. Pour les exercer, écrivez-nous à <strong>support@pas-a-pas.shop</strong>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">8. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles pour sécuriser vos données : mots de passe
          chiffrés, connexions HTTPS, stockage limité des données bancaires et accès restreint aux seules personnes habilitées.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">9. Modifications</h2>
        <p>
          Cette politique peut être mise à jour. Toute modification sera publiée sur cette page avec une nouvelle date de
          mise à jour.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">10. Contact</h2>
        <p>
          Pour toute question relative à vos données personnelles, écrivez-nous à
          <span className="font-medium text-pasapas-blue"> support@pas-a-pas.shop</span>.
        </p>
      </section>
    </div>
  )
}
