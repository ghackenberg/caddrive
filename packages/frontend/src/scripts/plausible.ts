import Plausible from 'plausible-tracker'

export const plausible = Plausible({
    domain: 'caddrive.com',
    apiHost: 'https://analytics.mindtastic.ai'
})

plausible.enableAutoPageviews()
plausible.enableAutoOutboundTracking()