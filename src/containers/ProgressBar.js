
const ProgressBar=(props)=>{
    const {bgcolor, completed} = props;

    const containerStyles = {
        height: 20,
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        marginTop:10,
        marginBottom:10,
       
    }

    const circularProgressStyle={
        position:'relative',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        height:'60px',
        width:'60px',
        borderRadius:'50%',
        background:`conic-gradient(#0072c6 ${completed * 3.6 }deg, #ededed 0deg)`
    }
    
    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: '#5e99aa',
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 1s ease-in-out',
    }
    
    const labelStyles = {
        padding: 5,
        color: '#005899',
        fontWeight: 'bold'
    }

    return(
        <>
            <div style={containerStyles} >
                <div style={fillerStyles}>
                    <span style={labelStyles}>{`${completed}%`}</span>
                </div>
            </div>
        </>
    )
};

export default ProgressBar;