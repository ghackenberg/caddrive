import Plausible from 'plausible-tracker'

export const plausible = Plausible({
    domain: 'https://analytics.mindtastic.ai',
    apiHost: 'caddrive.com'
})

plausible.enableAutoPageviews()
plausible.enableAutoOutboundTracking()