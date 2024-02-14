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
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Site } from "./types";
import { PARKING_SITES } from "./api";
import { Collection, QueryData } from "src/api/types";
import { Check, ExpandCircleDownSharp, SearchOutlined, Today } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Chart from "src/components/Recipes/Chart";
import { useQuery } from "src/api/query";


const DashboardRecipes: React.FC = () => {
    const [search, setSearch] = useState(''); // Site name
    const [date, setDate] = useState(startOfMonth(Date.now()));
    // const [sitesQuery, { data , loading, error }] = useLazyQuery<{ taxeParkingSites: Collection<Site>}>(PARKING_SITES);
    const { fetch, data: sites, loading, error } = useQuery<Site, { taxeParkingSites: Collection<Site>}>(PARKING_SITES);
    const[selectedSites, setSelectedSites] = useState<Site[]>([]);
    
    const goToThisMonth = () => {
        setDate(startOfMonth(Date.now()));
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
                    <FormControl fullWidth>
                        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                label='Site'
                                multiple
                                value={selectedSites}
                                onChange={({target: { value }}) => {
                                    setSelectedSites(typeof value !== 'string' ? value : []);
                                }}
                                fullWidth
                            >
                                {sites?.sort(sortByName).map(site => (
                                    <MenuItem key={site.id.toString()} value={site}>{site.name}</MenuItem>
                                ))}
                            </Select>
                    </FormControl>
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
                                    views={['month', 'year']}
                                    label="Date"
                                    openTo="month"
                                    value={date}
                                    onChange={(value) => {
                                        setDate(value);
                                    }}
                                    renderInput={(params) => <TextField {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <IconButton onClick={goToThisMonth}><Today /></IconButton>
                        </Grid>
                    </Grid>                            
                </CardContent>
            </Card>
        </Grid>
        <br />
        <Grid item xs={12} sx={{ marginBottom: 5 }}>
            { loading && <LinearProgress sx={{ marginX: 5 }} />}
            <Grid container spacing={2}>
                {selectedSites?.sort(sortByName).map((site, index) => (
                    <Grid item xs={12} md={6} key={index + ''}>
                        <Chart site={site} date={date} endDate={endOfMonth(date)} adaptBy="day" />
                    </Grid>
                ))}
            </Grid>
            <br />
        </Grid>
      </Grid>
    </Container>
    );
}

export default DashboardRecipes;