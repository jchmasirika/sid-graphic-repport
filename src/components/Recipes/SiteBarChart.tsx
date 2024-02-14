import ReactApexChart from "react-apexcharts";

export const SiteBarChart = ({ series, categories }) => {
    // console.log(series, categories);
    const options = {
        chart: {
            id: 'area-chart',
            toolbar: {
              show: false
            }
        },
        plotOptions: {
          bar: {
            columnWidth: '100%',
            borderRadius: 4
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 8,
          colors: ['transparent']
        },
        xaxis: {
            categories
        },
        grid: {
            show: false
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    yaxis: {
                        show: false
                    }
                }
            }
        ]
    };

    return (
        <ReactApexChart height={500} options={options} series={series} type={'bar'} />
    )
}