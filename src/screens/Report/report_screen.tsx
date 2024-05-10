import { View, Text, processColor, StyleSheet, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { PieChart } from "react-native-charts-wrapper";
import { dimnensHeight } from '../../config/font';
import { AppBarHeader } from '../../component/AppBarHeader';
import { MapData } from '../../services/database/models/MapData';
import { BeanMapData } from '../../services/database/models/bean_map';
import { useSelector } from 'react-redux';
const dataPieChart = {
    dataSets: [
        {
            values: [
                {label: "VB mới nhất",value: 0 },
                {label: "VB yêu thích", value: 0 },
                { label: "VB xem nhiều",value: 0 },
                {label: "Bộ tiêu chuẩn",value: 0 },
            ],
            label: "",
            config: {
                colors: [
                    processColor("#f87080"),
                    processColor("#fdc065"),
                    processColor("#ab89f7"),
                    processColor("#dbedea"),

                    processColor("#fff3f5"),
                    processColor("#ffe7ea"),
                    processColor("#fdedde"),
                    processColor("#f26472")
                ],
                drawValues: true,
                valueTextSize: 15,
                valueTextColor: processColor("#000"),
                valueFormatter: "#.#'%'",
                sliceSpace: 5,
                selectionShift: 100,
                yValuePosition: "OUTSIDE_SLICE",
            },
        },
    ],
    highlights: [{ x: 2 }],
};
export const Report_Screen = () => {
    const [listDataCategory, SetListDataCategory] = useState([])
    const [markersLocal, setmarkersLocal] = useState<BeanMapData[]>([])
    const [dataChart, SetDataChart] = useState(dataPieChart)
    const isUpdateFromDetail = useSelector((state: any) => state.detail.IsUpdate);
    const IsUpdateFromHome = useSelector((state: any) => state.detail.setIsUpdateHome);
    const chartDimention = useMemo(() => {
        const scale = Dimensions.get('window').scale
        const dimention = dimnensHeight(scale)
        return dimention
    }, [])

    useEffect(() => {
        try {
            const fetchData = async () => {
                try {
                    const data = await MapData.getAll(100, 0);
                    setmarkersLocal(data);

                    const countCategories = () => {
                        const count = {}
                        markersLocal.forEach(item => {
                            if (count[item.Category]) {
                                count[item.Category]++
                            } else {
                                count[item.Category] = 1
                            }
                        })
                        return count
                    }
                    const categoryCounts = countCategories();
                    const flatListData = Object.keys(categoryCounts).map(category => ({
                        category,
                        count: categoryCounts[category],
                    }));
                    SetListDataCategory(flatListData)
                    const values = flatListData.map(item => ({
                        value: item.count,
                        label: item.category,
                    }));
                    const newData = {
                        dataSets: [
                            {
                                ...dataChart?.dataSets[0],
                                values: values,
                            },
                        ],
                        description: {
                          text: 'This is Pie chart description',
                          textSize: 15,
                          textColor: processColor('darkgray'),
                        }, 
                      };
                    // @ts-ignore
                    SetDataChart(newData);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        } catch (error) {
            console.log("Fetch Data Error: " + error)
        }
    },[isUpdateFromDetail,IsUpdateFromHome]);

    const renderItem = ({ item }: any) => (
        <View style={{ paddingVertical: 5, marginLeft: '10%', flexDirection: 'row' }}>
            <View style={{ backgroundColor: '#f87080', width: 20, height: 20 }}>
            </View>
            <Text style={{ marginLeft: '2%' }}>{`Category ${item.category}: ${item.count}`}</Text>
        </View>
    );
    return (
        <View style={styles.container}>
            {/* Header */}
            <AppBarHeader title={'Report'} />

            <PieChart
                style={[styles.viewChart, {
                    // height: 20 + (chartDimention) + '%',
                    height: '50%',
                    width: '220%' + (chartDimention * Dimensions.get('window').scale) + '%',
                    alignSelf: 'center',
                    marginTop: 15

                }]}
                logEnabled={true}
                chartBackgroundColor={processColor("transparent")}
                chartDescription={{ text: "" }}
                data={dataChart}
                legend={{
                    enabled: false, // Disable legend
                    horizontalAlignment: 'CENTER', // Set legend position to the left
                    verticalAlignment: 'TOP',// Adjust vertical alignment if necessary
                }}
                highlights={[]}
                noDataText={"No data chart !"}
                entryLabelColor={processColor("black")}
                entryLabelTextSize={12}
                touchEnabled={false}
                drawEntryLabels={true}
                usePercentValues={true}
                rotationEnabled={true}
                centerText={""}
                onSelect={() => { }}
                centerTextRadiusPercent={0}
                holeRadius={30}
                transparentCircleRadius={0}
                maxAngle={360}
                rotationAngle={45}
            />
            <View
                style={
                    {
                        width: '100%',
                        backgroundColor: 'rgb(242, 242, 242)',
                        height: '60%',
                        flexDirection: 'column',
                        marginTop: 15
                    }
                }>
                <FlatList
                    data={listDataCategory}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>



        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    viewChart: {
        backgroundColor: 'white',
        borderRadius: 15,
        fontSize: 18,
        elevation: 8,
        shadowColor: 'lightgrey',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },

    view_chart: {
        width: '70%',
        height: 100,
        alignSelf: 'center',
        backgroundColor: 'blue',
        flexDirection: 'column',
        borderRadius: 25,
        shadowOffset: {
            width: 5,   // Horizontal shadow offset
            height: 5,  // Vertical shadow offset
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5, // Android only, controls the depth of the shadow
    },

});