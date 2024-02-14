import { Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { adaptSessionData } from "src/api/session-adaptator";
import { Session, Site } from "src/content/recipes/types";
import { SiteBarChart } from "./SiteBarChart";
import { numericFormatter } from "react-number-format";
import { useState } from "react";

const DetailSiteModal: React.FC<{ sessions: Session[], site: Site, open: boolean, onClose: () => void }> = ({ sessions, site, open, onClose }) => {
    const subSites = new Map<string, string>(site.sectionsArray.map(site => [site.id.toString(), site.name]))
    const sessionsBySubSite = adaptSessionData(sessions, 'site').map(([key, data]) => {
        const keys = key.split('/');
        const site = subSites.get(keys[3]);

        return { ...data, site };
    });
    const [search, setSearch] = useState('');

    const getChartData = () => {
          const categories = [];
          const values = [];
          const received = [];
          const missing = [];
          const invMissing = [];
    
          sessionsBySubSite.forEach((session) => {
            categories.push(session.site);
            values.push(session.total);
            received.push(session.received);
            missing.push(session.missing);
            invMissing.push(session.invoiceMissing);
          });
    
          const series = [
            { name: 'Montant machine', data: values },
            { name: 'Argent perçu', data: received },
            { name: 'Manquant (CDF)', data: missing },
            { name: 'Factures ratés (CDF): ', data: invMissing }
          ];
        return { series, categories};
        
    };


    return (
        <Dialog fullScreen sx={{ marginX: '5vw' }} open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h2" sx={{ textAlign: 'center' }}>Details des sessions du site {site.name}</Typography>
            </DialogTitle>
            <DialogContent>
                {sessionsBySubSite.length === 0 && (
                    <Typography sx={{ textAlign: 'center'}}>Aucun contenu</Typography>
                )}
                {sessionsBySubSite.length !== 0 && (
                    <>
                        <SiteBarChart {...getChartData()} />
                        <TextField value={search} onChange={({ target: { value }}) => setSearch(value)} />
                        <Table>
                            <TableHead>
                                <TableCell>Site</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Total Machine</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Montant réçu</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Manquant</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Facture raté</TableCell>
                            </TableHead>
                            <TableBody>
                                {sessionsBySubSite.filter(value => value?.site?.toLowerCase().includes(search.toLowerCase())).map((session, index) => (
                                    <TableRow key={index.toString()}>
                                        <TableCell>{session.site}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(session.total + '', { thousandSeparator: ' ' })}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(session.received + '', { thousandSeparator: ' ' })}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(session.missing + '', { thousandSeparator: ' ' })}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(session.invoiceMissing + '', { thousandSeparator: ' ' })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableHead>
                                <TableCell>Total</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(sessionsBySubSite.filter(value => value?.site?.toLowerCase().includes(search.toLowerCase())).map((session => session.total)).reduce((a, b) => a + b, 0).toString(), { thousandSeparator: ' '})}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(sessionsBySubSite.filter(value => value?.site?.toLowerCase().includes(search.toLowerCase())).map((session => session.received)).reduce((a, b) => a + b, 0).toString(), { thousandSeparator: ' '})}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(sessionsBySubSite.filter(value => value?.site?.toLowerCase().includes(search.toLowerCase())).map((session => session.missing)).reduce((a, b) => a + b, 0).toString(), { thousandSeparator: ' '})}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{numericFormatter(sessionsBySubSite.filter(value => value?.site?.toLowerCase().includes(search.toLowerCase())).map((session => session.invoiceMissing)).reduce((a, b) => a + b, 0).toString(), { thousandSeparator: ' '})}</TableCell>
                            </TableHead>
                        </Table>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
};

export default DetailSiteModal;