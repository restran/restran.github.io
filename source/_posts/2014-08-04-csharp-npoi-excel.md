---
title: C# 中 NPOI 库读写 Excel 文件的方法
layout: post
category: [技术]
tagline: 
keywords: C#,csharp,NPOI,excel
tags: [C#]
---

[NPOI][1] 是开源的 [POI][2] 项目的.NET版，可以用来读写Excel，Word，PPT文件。在处理Excel文件上，NPOI 可以同时兼容 xls 和 xlsx。官网提供了一份 [Examples][3]，给出了很多应用场景的例子，打包好的二进制文件类库，也仅有几MB，使用非常方便。

## 读Excel

NPOI使用`HSSFWorkbook`类来处理xls，`XSSFWorkbook`类来处理xlsx，它们都继承接口`IWorkbook`，因此可以通过`IWorkbook`来统一处理xls和xlsx格式的文件。

以下是简单的例子

```csharp
public void ReadFromExcelFile(string filePath)
{
    IWorkbook wk = null;
    string extension = System.IO.Path.GetExtension(filePath);
    try
    {
        FileStream fs = File.OpenRead(filePath);
        if (extension.Equals(".xls"))
        {
            //把xls文件中的数据写入wk中
            wk = new HSSFWorkbook(fs);
        }
        else
        {
            //把xlsx文件中的数据写入wk中
            wk = new XSSFWorkbook(fs);
        }

        fs.Close();
        //读取当前表数据
        ISheet sheet = wk.GetSheetAt(0);

        IRow row = sheet.GetRow(0);  //读取当前行数据
        //LastRowNum 是当前表的总行数-1（注意）
        int offset = 0;
        for (int i = 0; i <= sheet.LastRowNum; i++)
        {
            row = sheet.GetRow(i);  //读取当前行数据
            if (row != null)
            {
                //LastCellNum 是当前行的总列数
                for (int j = 0; j < row.LastCellNum; j++)
                {
                    //读取该行的第j列数据
                    string value = row.GetCell(j).ToString();
                    Console.Write(value.ToString() + " ");
                }
                Console.WriteLine("\n");
            }
        }
    }
    
    catch (Exception e)
    {
        //只在Debug模式下才输出
        Console.WriteLine(e.Message);
    }
}
```

Excel中的单元格是有不同数据格式的，例如数字，日期，字符串等，在读取的时候可以根据格式的不同设置对象的不同类型，方便后期的数据处理。

```csharp
//获取cell的数据，并设置为对应的数据类型
public object GetCellValue(ICell cell)
{
    object value = null;
    try
    {
        if (cell.CellType != CellType.Blank)
        {
            switch (cell.CellType)
            {
                case CellType.Numeric:
                    // Date comes here
                    if (DateUtil.IsCellDateFormatted(cell))
                    {
                        value = cell.DateCellValue;
                    }
                    else
                    {
                        // Numeric type
                        value = cell.NumericCellValue;
                    }
                    break;
                case CellType.Boolean:
                    // Boolean type
                    value = cell.BooleanCellValue;
                    break;
                case CellType.Formula:
                    value = cell.CellFormula;
                    break;
                default:
                    // String type
                    value = cell.StringCellValue;
                    break;
            }
        }
    }
    catch (Exception)
    {
        value = "";
    }

    return value;
}
```

> **特别注意**的是`CellType`中没有Date，而日期类型的数据类型是`Numeric`，其实日期的数据在Excel中也是以数字的形式存储。可以使用`DateUtil.IsCellDateFormatted`方法来判断是否是日期类型。

有了`GetCellValue`方法，写数据到Excel中的时候就要有`SetCellValue`方法，缺的类型可以自己补。

```csharp
//根据数据类型设置不同类型的cell
public static void SetCellValue(ICell cell, object obj)
{
    if (obj.GetType() == typeof(int))
    {
        cell.SetCellValue((int)obj);
    }
    else if (obj.GetType() == typeof(double))
    {
        cell.SetCellValue((double)obj);
    }
    else if (obj.GetType() == typeof(IRichTextString))
    {
        cell.SetCellValue((IRichTextString)obj);
    }
    else if (obj.GetType() == typeof(string))
    {
        cell.SetCellValue(obj.ToString());
    }
    else if (obj.GetType() == typeof(DateTime))
    {
        cell.SetCellValue((DateTime)obj);
    }
    else if (obj.GetType() == typeof(bool))
    {
        cell.SetCellValue((bool)obj);
    }
    else
    {
        cell.SetCellValue(obj.ToString());
    }
}
```

`cell.SetCellValue()`方法只有四种重载方法，参数分别是`string`, `bool`, `DateTime`, `double`, `IRichTextString`
设置公式使用`cell.SetCellFormula(string formula)`

## 写Excel

以下是简单的例子，更多信息可以参见官网提供的[Examples][4]。

```csharp
public void WriteToExcel(string filePath)
{
    //创建工作薄  
    IWorkbook wb;
    string extension = System.IO.Path.GetExtension(filePath);
    //根据指定的文件格式创建对应的类
    if (extension.Equals(".xls"))
    {
        wb = new HSSFWorkbook();
    }
    else
    {
        wb = new XSSFWorkbook();
    }

    ICellStyle style1 = wb.CreateCellStyle();//样式
    style1.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Left;//文字水平对齐方式
    style1.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;//文字垂直对齐方式
    //设置边框
    style1.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
    style1.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
    style1.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
    style1.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
    style1.WrapText = true;//自动换行

    ICellStyle style2 = wb.CreateCellStyle();//样式
    IFont font1 = wb.CreateFont();//字体
    font1.FontName = "楷体";
    font1.Color = HSSFColor.Red.Index;//字体颜色
    font1.Boldweight = (short)FontBoldWeight.Normal;//字体加粗样式
    style2.SetFont(font1);//样式里的字体设置具体的字体样式
    //设置背景色
    style2.FillForegroundColor = NPOI.HSSF.Util.HSSFColor.Yellow.Index;
    style2.FillPattern = FillPattern.SolidForeground;
    style2.FillBackgroundColor = NPOI.HSSF.Util.HSSFColor.Yellow.Index;
    style2.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Left;//文字水平对齐方式
    style2.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;//文字垂直对齐方式

    ICellStyle dateStyle = wb.CreateCellStyle();//样式
    dateStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Left;//文字水平对齐方式
    dateStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;//文字垂直对齐方式
    //设置数据显示格式
    IDataFormat dataFormatCustom = wb.CreateDataFormat();
    dateStyle.DataFormat = dataFormatCustom.GetFormat("yyyy-MM-dd HH:mm:ss");

    //创建一个表单
    ISheet sheet = wb.CreateSheet("Sheet0");
    //设置列宽
    int[] columnWidth = { 10, 10, 20, 10 };
    for (int i = 0; i < columnWidth.Length; i++)
    {
        //设置列宽度，256*字符数，因为单位是1/256个字符
        sheet.SetColumnWidth(i, 256 * columnWidth[i]);
    }

    //测试数据
    int rowCount = 3, columnCount = 4;
    object[,] data = {
        {"列0", "列1", "列2", "列3"},
        {"", 400, 5.2, 6.01},
        {"", true, "2014-07-02", DateTime.Now}
        //日期可以直接传字符串，NPOI会自动识别
        //如果是DateTime类型，则要设置CellStyle.DataFormat，否则会显示为数字
    };

    IRow row;
    ICell cell;
    
    for (int i = 0; i < rowCount; i++)
    {
        row = sheet.CreateRow(i);//创建第i行
        for (int j = 0; j < columnCount; j++)
        {
            cell = row.CreateCell(j);//创建第j列
            cell.CellStyle = j % 2 == 0 ? style1 : style2;
            //根据数据类型设置不同类型的cell
            object obj = data[i, j];
            SetCellValue(cell, data[i, j]);
            //如果是日期，则设置日期显示的格式
            if (obj.GetType() == typeof(DateTime))
            {
                cell.CellStyle = dateStyle;
            }
            //如果要根据内容自动调整列宽，需要先setCellValue再调用
            //sheet.AutoSizeColumn(j);
        }
    }

    //合并单元格，如果要合并的单元格中都有数据，只会保留左上角的
    //CellRangeAddress(0, 2, 0, 0)，合并0-2行，0-0列的单元格
    CellRangeAddress region = new CellRangeAddress(0, 2, 0, 0);
    sheet.AddMergedRegion(region);

    try
    {
        FileStream fs = File.OpenWrite(filePath);
        wb.Write(fs);//向打开的这个Excel文件中写入表单并保存。  
        fs.Close();
    }
    catch (Exception e)
    {
        Debug.WriteLine(e.Message);
    }
}
```

如果想要设置单元格为只读或可写，可以参考[这里][5]，方法如下：

```csharp
ICellStyle unlocked = wb.CreateCellStyle();
unlocked.IsLocked = false;//设置该单元格为非锁定
cell.SetCellValue("未被锁定");
cell.CellStyle = unlocked;
...
//保护表单，password为解锁密码
//cell.CellStyle.IsLocked = true;的单元格将为只读
sheet.ProtectSheet("password");
```

`cell.CellStyle.IsLocked` 默认就是true，因此`sheet.ProtectSheet("password")`一定要执行，才能实现锁定单元格，对于不想锁定的单元格，就一定要设置`cell`的`CellStyle`中的`IsLocked = false`


  [1]: https://npoi.codeplex.com/ "NPOI"
  [2]: http://poi.apache.org/%20POI
  [3]: https://npoi.codeplex.com/releases
  [4]: https://npoi.codeplex.com/releases
  [5]: http://www.cnblogs.com/atao/archive/2010/07/13/1568917.html