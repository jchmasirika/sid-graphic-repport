import { useLazyQuery } from "@apollo/client";
import {
    Grid,
    Container,
    TextField,
    Card,
    Divider,
    CardHeader,
    CardContent,
    IconButton,
    CircularProgress,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    LinearProgress,
    Popover,
    Tooltip,
    Badge,
    Chip
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Site } from "./types";
import { PARKING_SITES } from "./api";
import { Collection, QueryData } from "src/api/types";
import { Check, SearchOutlined, Today } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Chart from "src/components/Recipes/Chart";
import { useQuery } from "src/api/query";


const DaylyDashboardRecipes: React.FC = () => {
    const [search, setSearch] = useState(''); // Site name
    const [date, setDate] = useState(startOfDay(Date.now()));
    // const [sitesQuery, { data , loading, error }] = useLazyQuery<{ taxeParkingSites: Collection<Site>}>(PARKING_SITES);
    const { fetch, data: sites, loading, error } = useQuery<Site, { taxeParkingSites: Collection<Site>}>(PARKING_SITES);
    
    const goToToday = () => {
        setDate(startOfDay(Date.now()));
    };

    const sortByName = (a: Site, b: Site) => {
        if(a.name < b.name) return -1;
        else if(a.name > b.name) return 1;
        return 0;
    };


    useEffect(() => {
        fetch();
    }, []);

    return (
      <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      > 
        <Grid item xs={12} md={6}>
            <br />
            <Card>
                <CardContent>
                    <TextField
                        value={search}
                        onChange={({ target: { value }}) => {
                            setSearch(value);
                        }}
                        id="serie_number"
                        label="Site"
                        autoFocus
                        fullWidth
                    />
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={6}>
            <br />
            <Card>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={9}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['day', 'month', 'year']}
                                    label="Date"
                                    openTo="day"
                                    value={date}
                                    onChange={(value) => {
                                        setDate(value);
                                    }}
                                    renderInput={(params) => <TextField {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <IconButton onClick={goToToday}><Today /></IconButton>
                        </Grid>
                    </Grid>                            
                </CardContent>
            </Card>
        </Grid>
        <br />
        <Grid item xs={12}>
            { loading && <LinearProgress sx={{ marginX: 5 }} />}
            <Grid container spacing={2}>
                {sites?.sort(sortByName).filter((site) => site.name.toLowerCase().includes(search.toLowerCase())).map((site, index) => (
                    <Grid item xs={12} md={6} key={index + ''}>
                        <Tooltip placement="bottom" title={site?.sectionsArray.length - 1 > 0 ? site.sectionsArray.map(site => site.name).join(', ') : 'Aucun sous site'}>
                            <Chart site={site} date={date} endDate={endOfDay(date)} adaptBy="day" chartType='donut' />
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>
        </Grid>
      </Grid>
    </Container>
    );
}

export default DaylyDashboardRecipes;