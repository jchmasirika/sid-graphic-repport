import { Session, Site } from "src/content/recipes/types";
import DonutChart from "./DonutChart";
import LinearChart from "./LinearChart"
import { AdaptBy } from "src/api/session-adaptator";
import { useQuery } from "src/api/query";
import { Collection } from "src/api/types";
import { PARKING_SESSIONS } from "src/content/recipes/api";
import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, Chip, Dialog, Divider, FormControlLabel, LinearProgress, Modal, Switch, Tooltip, Typography } from "@mui/material";
import DetailSiteModal from "./DetailSiteModal";
import { numericFormatter } from "react-number-format";

const Chart: React.FC<{
    site: Site,
    date: Date,
    endDate: Date,
    adaptBy: AdaptBy,
    chartType?: 'donut'|'line'|'bar'
}> = ({ site, date, adaptBy, endDate, chartType = 'line' }) => {

    const { fetch, data: sessions, loading } = useQuery<Session, { parkingSessions: Collection<Session> }, { before: string, after: string, sites: string[]}>(PARKING_SESSIONS);
    const [type, setType] = useState<'donut'|'line'|'bar'>(chartType);
    const [infos, setInfos] = useState<{ total: number, missing: number, invoicesMissing: number, received: number }|undefined>({
        total: 0,
        missing: 0,
        invoicesMissing: 0,
        received: 0
    });
    const [showModal, setShowModal] = useState(false);

    const getSessions = async (site: Site) => {
        await fetch({ 
            options: {
                variables: {
                    after: date.toISOString(),
                    before: endDate.toISOString(),
                    sites: site?.sectionsArray.map((value) => value.id.toString())
                }
            }
        });
    };

    useEffect(() => {
        if(site) {
            getSessions(site);
        }
    }, [site, date]);

    useEffect(() => {
        if(sessions) {
            const total = sessions.map(session => session.total).reduce((a, b) => a + b, 0);
            const missing =  sessions.map(session => session.missing).reduce((a, b) => a + b, 0);
            const invoicesMissing =  sessions.map(session => session.invoiceMissing).reduce((a, b) => a + b, 0);
            setInfos({
                total,
                missing,
                invoicesMissing,
                received: total - missing - invoicesMissing
            });
        }
    },[sessions]);

    let chart = null;

    switch(type) {
        case 'line': chart = <LinearChart sessions={sessions} loading={loading} adaptBy={adaptBy} />; break;
        case 'donut': chart = <DonutChart sessions={sessions} loading={loading} adaptBy={adaptBy} />; break;
        case 'bar':  chart = null; break;
        default: chart = <LinearChart sessions={sessions} loading={loading} adaptBy={adaptBy} />; break;
    };

    

    return (
        <Box>
            <Card>
                <CardHeader onClick={() => setShowModal(true)} title={site.name} />
                { loading ? <LinearProgress sx={{ marginX: 5 }} /> : <Divider />}
                <Typography sx={{ marginLeft: 2, marginTop: 1}}>Montant Machine CDF: {numericFormatter(infos.total.toString(), {thousandSeparator: ' ' })}</Typography>
                <Typography sx={{ marginLeft: 2}}>Montant récçu CDF: {numericFormatter(infos.received.toString(), {thousandSeparator: ' ' })}</Typography>
                <Typography sx={{ marginLeft: 2}}>Manquant CDF: {numericFormatter(infos.missing.toString(), {thousandSeparator: ' ' })}</Typography>
                <Typography sx={{ marginLeft: 2}}>Factures ractés CDF: {numericFormatter(infos.invoicesMissing.toString(), {thousandSeparator: ' ' })}</Typography>

                <FormControlLabel sx={{ padding: 2}} control={<Switch checked={type === 'donut'} onClick={() => setType(type === 'line' ? 'donut' : 'line')} />} label='Donut' />
                <CardContent>
                    {chart}
                </CardContent>
            </Card>
            <DetailSiteModal open={showModal} onClose={() => setShowModal(false)} site={site} sessions={sessions} />
        </Box>
    )
};

export default Chart;
