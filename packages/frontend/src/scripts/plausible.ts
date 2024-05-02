import Plausible from 'plausible-tracker'

export const plausible = Plausible({
    domain: 'caddrive.com',
    apiHost: 'https://analytics.mentawise.com'
})

plausible.enableAutoPageviews()
//plausible.enableAutoOutboundTracking()