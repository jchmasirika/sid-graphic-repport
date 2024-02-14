import { Session, Site } from "src/content/recipes/types";
import DonutChart from "./DonutChart";
import LinearChart from "./LinearChart"
import { AdaptBy } from "src/api/session-adaptator";
import { useQuery } from "src/api/query";
import { Collection } from "src/api/types";
import endOfMonth from "date-fns/endOfMonth";
import { PARKING_SESSIONS } from "src/content/recipes/api";
import { ReactNode, useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, Dialog, Divider, FormControlLabel, LinearProgress, Modal, Switch, Tooltip, Typography } from "@mui/material";
import DetailSiteModal from "./DetailSiteModal";

const Chart: React.FC<{
    site: Site,
    date: Date,
    endDate: Date,
    adaptBy: AdaptBy,
    chartType?: 'donut'|'line'|'bar'
}> = ({ site, date, adaptBy, endDate, chartType = 'line' }) => {

    const { fetch, data: sessions, loading } = useQuery<Session, { parkingSessions: Collection<Session> }, { before: string, after: string, sites: string[]}>(PARKING_SESSIONS);
    const [type, setType] = useState<'donut'|'line'|'bar'>(chartType);
    const [infos, setInfos] = useState<{ total: number, missing: number, invoicesMissing: number }|undefined>({
        total: 0,
        missing: 0,
        invoicesMissing: 0
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
            setInfos({
                total: sessions.map(session => session.total).reduce((a, b) => a + b),
                missing: sessions.map(session => session.missing).reduce((a, b) => a + b),
                invoicesMissing: sessions.map(session => session.invoiceMissing).reduce((a, b) => a + b),
            });
        }
    }, []);

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
                <CardHeader onClick={() => setShowModal(true)} title={site.name} subheader={'Total machine: CDF ' + infos.total + ' - Manquant: CDF ' + infos.missing + ' - Ratés: CDF ' + infos.invoicesMissing} />
                { loading ? <LinearProgress sx={{ marginX: 5 }} /> : <Divider />}
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
