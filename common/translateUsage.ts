const translateUsage = ( usage : string ) => {
        switch (usage) {
            case "AUD":
                return "Auditorium";
            case "CMLB":
                return "Computer Lab";
            case "LAB":
                return "Lab";
            case "LCTR":
                return "Lecture Hall";
            case "MEET":
                return "Meeting Room";
            case "SDIO":
               return "Studio";
            case "TUSM":
                return "Tutorial Room";
            case "LIB":
                return "Library Study Room";
            default:
                return "";
        }
    }

export default translateUsage;
