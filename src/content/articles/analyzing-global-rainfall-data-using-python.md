---
title: "Analyzing Global Rainfall Data Using Python"
description: "We live in an era where massive amounts of data collected by satellites, weather stations, ocean buoys, and other sensors is freely available to everyone. This includes atmospheric measurements, temperature, humidity, rainfall, sea surface temperature, wave height, and countless other parameters. By analyzing this raw data, we can gain valuable insights into our planet’s condition…"
publishedAt: "2025-11-18T13:16:55"
authors: ["Nadim Rahman","Zahin Azmayeen"]
featuredImage: "/uploads/2025/11/rainfall-article-featured.png"
featuredImageAlt: ""
---

<p class="wp-block-paragraph">We live in an era where massive amounts of data collected by satellites, weather stations, ocean buoys, and other sensors is freely available to everyone. This includes atmospheric measurements, temperature, humidity, rainfall, sea surface temperature, wave height, and countless other parameters. By analyzing this raw data, we can gain valuable insights into our planet’s condition and processes. These insights allow us to make better decisions and create a better future.</p>



<p class="wp-block-paragraph">But before any of that, we first need to <strong>learn how to analyze</strong>. Extracting insights from these large datasets is a very involved process. Traditionally, you would install a large, often expensive, GIS software package. Then you would need to learn to navigate a complex interface, searching for the right tools hidden in layers of menus.</p>



<p class="wp-block-paragraph">In this article, we are going to try a simpler approach. We are going to use Python &#8211; a programming language &#8211; to process the dataset.</p>



<p class="wp-block-paragraph">Using Python might sound more complicated than using a graphical interface. But there are many advantages to this approach:</p>



<ul class="wp-block-list">
<li>Python is freely accessible, especially through services like Google Colab. So, you can easily follow along without doing extensive setup and it won&#8217;t cost you any money.</li>



<li>Instead of hunting through menus, we can describe our process directly in code.</li>



<li>The code becomes a history of our analysis &#8211; any point of which we can edit, rerun, and build upon.</li>



<li>Learning Python gives you transferable skills you can use in any data or GIS workflow.</li>



<li>GIS software itself uses Python under the hood so, you&#8217;ll also learn how these complex software suites work.</li>
</ul>



<p class="wp-block-paragraph">Of course, not every GIS task is better with programming. Many workflows are easier and faster in GIS software. Our goal isn’t to replace or forgo GIS tools &#8211; it’s to open up a different, more flexible way of working.</p>



<p class="wp-block-paragraph">We won’t cover programming basics here. We assume the reader has some prior experience of writing code. Don’t be intimidated if you haven&#8217;t programmed before &#8211; Python reads a lot like English. Try running and editing the code; you’ll be surprised how quickly you can learn. We’ll also try to explain every step in detail.</p>



<p class="wp-block-paragraph">We are going to learn to generate <strong>precipitation distribution maps</strong> using Python in <strong>Google Colab</strong>. Here is a high-level overview of the steps we need to perform:</p>



<p class="wp-block-paragraph">Our dataset is a subset of global precipitation dataset <strong><a href="https://www.chc.ucsb.edu/data/chirps" target="_blank" rel="noreferrer noopener">CHIRPS Version 2.0</a></strong>. We are focusing on Bangladesh, so we used ERDDAP to extract a spatial subset covering latitude 19°–27° and longitude 86°–94° in NetCDF format. We’ll then clip the dataset using a shapefile of Bangladesh so that we only have the data of Bangladesh. Then, we will explore the temporal dimension of rainfall by generating monthly visualizations.</p>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Mounting Google Drive in Colab</h2>



<p class="wp-block-paragraph">We have saved the necessary files in the <code>rainfall</code> folder at the root of our Google Drive. We begin by mounting our Google Drive so that Colab can access the data files stored there.</p>



<pre class="wp-block-code language-python"><code class="language-python">from google.colab import drive
drive.mount('/content/drive')</code></pre>



<p class="wp-block-paragraph">Let&#8217;s now check we if we can list the contents of our folder.</p>



<pre class="wp-block-code language-bash"><code class="language-bash">!ls -lh /content/drive/MyDrive/rainfall</code></pre>



<pre class="wp-block-code alignwide has-small-font-size"><code>total 55M
-rw------- 1 root root  48M May 28 15:46  chirps20GlobalMonthlyP05_Lon0360_d2a8_f216_cc43.nc
-rw------- 1 root root 6.6M Nov 16 04:53 'rainfall map generation.ipynb'
drwx------ 2 root root 4.0K Sep 30 18:27  shapefiles</code></pre>



<p class="wp-block-paragraph">Perfect! We can see our shapefile directory as well as our dataset file.</p>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Loading the Global Rainfall Dataset</h2>



<p class="wp-block-paragraph">The rainfall data comes in a <code><strong>NetCDF</strong></code> file, a common format for climate and Earth-system datasets. We load it using a library <code>xarray</code>, which is designed for multi-dimensional data.</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">import xarray as xr

filename = '/content/drive/MyDrive/rainfall/chirps20GlobalMonthlyP05_Lon0360_d2a8_f216_cc43.nc'
rainfall = xr.open_dataset(filename)
rainfall</code></pre>



<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<details class="wp-block-details has-small-font-size is-layout-flow wp-block-details-is-layout-flow"><summary>xarray.Dataset</summary>
<ul class="wp-block-list">
<li class="has-small-font-size">Dimensions:
<ul class="wp-block-list">
<li>time: 480</li>



<li>latitude: 161</li>



<li>longitude: 161</li>
</ul>
</li>



<li class="has-small-font-size">Coordinates: (3)
<ul class="wp-block-list">
<li>time(time)</li>



<li>latitude(latitude)</li>



<li>longitude(longitude)</li>
</ul>
</li>



<li class="has-small-font-size">Data variables: (1)
<ul class="wp-block-list">
<li>precip</li>
</ul>
</li>



<li class="has-small-font-size">Indexes: (3)
<ul class="wp-block-list">
<li>timePandasIndexPandasIndex</li>



<li>latitudePandasIndexPandasIndex</li>



<li>longitudePandasIndexPandasIndex</li>
</ul>
</li>



<li class="has-small-font-size">Attributes: (31)</li>
</ul>
</details>



<p class="wp-block-paragraph">If we look at the output of the code block, we can see that it contains the expected data: <code>precip</code> or precipitation data variable, the three dimensions time, latitude, and longitude.</p>
</div>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Visualizing the First Layer</h2>



<p class="wp-block-paragraph">We plot the precipitation for the first time slice in the dataset.</p>



<pre class="wp-block-code language-python wp-container-content-9fac21de"><code class="language-python">rainfall&#91;'precip'].isel(time=0).plot(cmap='YlGnBu')</code></pre>



<figure class="wp-block-image aligncenter size-full wp-container-content-bdf53215"><img loading="lazy" width="583" height="469" src="/uploads/2025/11/image-1.png" alt="" class="wp-image-206" srcset="/uploads/2025/11/image-1.png 583w, /uploads/2025/11/image-1-300x241.png 300w" sizes="auto, (max-width: 583px) 100vw, 583px" /></figure>



<p class="wp-block-paragraph">On the output, we can see a precipitation map covering latitude 19°–27° and longitude 86°–94°. Since we only care about Bangladesh, we’ll soon clip the data.</p>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Loading the Bangladesh Shapefile</h2>



<p class="wp-block-paragraph">We load the shapefile using <code>GeoPandas</code>, which is a common library for handling vector spatial data.</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">import geopandas as gpd

shapefile = '/content/drive/MyDrive/rainfall/shapefiles/bgd_admbnda_adm1_bbs_20201113.shp'
bd = gpd.read_file(shapefile)
bd</code></pre>



<figure class="wp-block-table alignwide" style="font-size:0.5rem"><table><thead><tr><th></th><th>Shape_Leng</th><th>Shape_Area</th><th>ADM1_EN</th><th>ADM1_PCODE</th><th>ADM1_REF</th><th>ADM1ALT1EN</th><th>ADM1ALT2EN</th><th>ADM0_EN</th><th>ADM0_PCODE</th><th>date</th><th>validOn</th><th>validTo</th><th>geometry</th></tr></thead><tbody><tr><th>0</th><td>25.424604</td><td>0.889395</td><td>Barisal</td><td>BD10</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>1</th><td>30.287321</td><td>2.737796</td><td>Chittagong</td><td>BD20</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>2</th><td>12.197758</td><td>1.806506</td><td>Dhaka</td><td>BD30</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>3</th><td>38.409385</td><td>1.826575</td><td>Khulna</td><td>BD40</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>4</th><td>8.166577</td><td>0.941812</td><td>Mymensingh</td><td>BD45</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>POLYGON&#8230;</td></tr><tr><th>5</th><td>8.410221</td><td>1.624856</td><td>Rajshahi</td><td>BD50</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>POLYGON&#8230;</td></tr><tr><th>6</th><td>15.369683</td><td>1.465681</td><td>Rangpur</td><td>BD55</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>7</th><td>9.800293</td><td>1.103963</td><td>Sylhet</td><td>BD60</td><td>None</td><td>None</td><td>None</td><td>Bangladesh</td><td>BD</td><td>2015-01-01</td><td>2020-11-13</td><td>NaT</td><td>MULTIPOLYGON&#8230;</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">On the output, we can see a lot of columns that are unnecessary to us. We only want to store the division names which seems to be in a column named <code>ADM1_EN</code>. We drop unnecessary columns and rename the column that stores division names.</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">bd.drop(columns=&#91;'Shape_Leng', 'Shape_Area', 'ADM1_PCODE', 'ADM1_REF',
       'ADM1ALT1EN', 'ADM1ALT2EN', 'ADM0_EN', 'ADM0_PCODE', 'date', 'validOn',
       'validTo'],inplace=True)

bd = bd.rename(columns={'ADM1_EN':'Division'})
bd</code></pre>



<figure class="wp-block-table aligncenter has-small-font-size"><table><thead><tr><th></th><th>Division</th><th>geometry</th></tr></thead><tbody><tr><th>0</th><td>Barisal</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>1</th><td>Chittagong</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>2</th><td>Dhaka</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>3</th><td>Khulna</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>4</th><td>Mymensingh</td><td>POLYGON&#8230;</td></tr><tr><th>5</th><td>Rajshahi</td><td>POLYGON&#8230;</td></tr><tr><th>6</th><td>Rangpur</td><td>MULTIPOLYGON&#8230;</td></tr><tr><th>7</th><td>Sylhet</td><td>MULTIPOLYGON&#8230;</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">Looks clean! We can now visualize it:</p>



<pre class="wp-block-code language-python wp-container-content-9cfa9a5a"><code class="language-python">bd.plot()</code></pre>



<figure class="wp-block-image aligncenter size-full wp-container-content-9cfa9a5a"><img loading="lazy" width="318" height="420" src="/uploads/2025/11/image.png" alt="" class="wp-image-205" srcset="/uploads/2025/11/image.png 318w, /uploads/2025/11/image-227x300.png 227w" sizes="auto, (max-width: 318px) 100vw, 318px" /></figure>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Clipping the Rainfall Data to Bangladesh</h2>



<p class="wp-block-paragraph">To clip raster data using a shapefile, we install the library <code>rioxarray</code>, which adds GIS-like operations to <code>xarray</code>. <code>rioxarray</code> isn&#8217;t available in Colab by default, so, we need to install with this command:</p>



<pre class="wp-block-code language-bash"><code class="language-bash">!pip install rioxarray</code></pre>



<p class="wp-block-paragraph">Now we configure the spatial dimensions so <code>rioxarray </code>can understand them:</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">import rioxarray

rainfall.rio.set_spatial_dims(x_dim="longitude", y_dim="latitude", inplace=True)</code></pre>



<p class="wp-block-paragraph">We also assign the correct coordinate reference system (WGS 84):</p>



<pre class="wp-block-code language-python"><code class="language-python">rainfall.rio.write_crs("epsg:4326", inplace=True)</code></pre>



<p class="wp-block-paragraph">Now we clip our rainfall data raster using the Bangladesh shapefile boundary and view the clipped dataset:</p>



<pre class="wp-block-code language-python"><code class="language-python">bd_rainfall = rainfall.rio.clip(bd.geometry)
bd_rainfall = bd_rainfall.drop_vars('spatial_ref')

import matplotlib.pyplot as plt

plt.figure(figsize=(7,8))
bd_rainfall&#91;'precip'].isel(time=0).plot(cmap='YlGnBu')</code></pre>



<figure class="wp-block-image aligncenter size-full"><img loading="lazy" width="605" height="701" src="/uploads/2025/11/image-2.png" alt="" class="wp-image-207" srcset="/uploads/2025/11/image-2.png 605w, /uploads/2025/11/image-2-259x300.png 259w" sizes="auto, (max-width: 605px) 100vw, 605px" /></figure>



<p class="wp-block-paragraph">Now the dataset contains only rainfall values inside Bangladesh.</p>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Plotting the data of a specific month</h2>



<p class="wp-block-paragraph">The dataset spans several decades, so we can extract data for any year and month within that.</p>



<p class="wp-block-paragraph">Example: Rainfall in the month of March (third month in the dataset) of year 2000:</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">plt.figure(figsize=(7,8))
bd_rainfall.sel(time=rainfall&#91;'time'].dt.year == 2000)&#91;'precip'].isel(time=2).plot(cmap='YlGnBu')</code></pre>



<figure class="wp-block-image aligncenter size-full"><img loading="lazy" width="614" height="701" src="/uploads/2025/11/image-6.png" alt="" class="wp-image-211" srcset="/uploads/2025/11/image-6.png 614w, /uploads/2025/11/image-6-263x300.png 263w" sizes="auto, (max-width: 614px) 100vw, 614px" /></figure>



<p class="code-highlighter wp-block-paragraph">If we look at the code, specifically the line <code>bd_rainfall.sel(time=rainfall['time'].dt.year == 2000)['precip'].isel(time=2).plot(cmap='YlGnBu')</code>, you can see that we&#8217;re using <code>.sel()</code> to select the year like this: <code>.sel(time=rainfall['time'].dt.year == 2000)</code> where 2000 is the year and we&#8217;re selecting the third month using <code>.isel()</code> like this: <code>.isel(time=2)</code> where 2 is the number of the month (month is counted from 0 or it is zero-indexed, so, 2 selects the third month). I think you can guess how we can plot the data for September 2003:</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">plt.figure(figsize=(7,8))<br>bd_rainfall.sel(time=rainfall&#91;'time'].dt.year == 2003)&#91;'precip'].isel(time=8).plot(cmap='YlGnBu')</code></pre>



<figure class="wp-block-image aligncenter size-full"><img loading="lazy" width="614" height="701" src="/uploads/2025/11/image-4.png" alt="" class="wp-image-209" srcset="/uploads/2025/11/image-4.png 614w, /uploads/2025/11/image-4-263x300.png 263w" sizes="auto, (max-width: 614px) 100vw, 614px" /></figure>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Creating a Function to Visualize All 12 Months</h2>



<p class="wp-block-paragraph">Let&#8217;s now create a larger plot that contains all 12 months of a year (2000).</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">year = bd_rainfall.sel(time=rainfall&#91;'time'].dt.year == 2000)
fig = plt.figure(figsize=(25, 20),dpi=500)
plt.suptitle('Monthly Mean Rainfall of 2000.',y=0.93,fontsize=30)

gs = fig.add_gridspec(3, 4, hspace=0.15, wspace=0.1)
(ax1, ax2,ax3, ax4),(ax5,ax6,ax7, ax8),(ax9, ax10,ax11,ax12) = gs.subplots(sharex='col', sharey='row')
axes = &#91;ax1, ax2,ax3, ax4,ax5,ax6,ax7, ax8,ax9, ax10,ax11,ax12]

for i in range(12):
    c = axes&#91;i].contourf(year&#91;'precip'].isel(time=i),cmap='YlGnBu')
    axes&#91;i].set_title(i,fontsize=12)
    fig.colorbar(c, ax=axes&#91;i], orientation='vertical', fraction=0.1, pad=0.05)</code></pre>



<figure class="wp-block-image alignwide size-full"><img loading="lazy" width="10085" height="8415" src="/uploads/2025/11/image-7.png" alt="" class="wp-image-221"/></figure>



<p class="wp-block-paragraph">This code block is quite a complex, so, here&#8217;s a line-by-line explanation:</p>



<p class="code-highlighter wp-block-paragraph">On the first line <code>year = bd_rainfall.sel(time=rainfall['time'].dt.year == 2000)</code>, we&#8217;re selecting the rainfall data for the year 2000 and storing it in the variable <code>year</code>. </p>



<p class="wp-block-paragraph">We can make it a bit nicer by adding the month names to the plots:</p>



<pre class="wp-block-code alignwide language-python"><code class="language-python">months = &#91;"January","February","March", "April","May","June",
          "July","August", "September","October","November","December"]

year = bd_rainfall.sel(time=rainfall&#91;'time'].dt.year == 2000)
fig = plt.figure(figsize=(25, 20),dpi=500)
plt.suptitle('Monthly Mean Rainfall of 2000.',y=0.93,fontsize=30)

gs = fig.add_gridspec(3, 4, hspace=0.15, wspace=0.1)
(ax1, ax2,ax3, ax4),(ax5,ax6,ax7, ax8),(ax9, ax10,ax11,ax12) = gs.subplots(sharex='col', sharey='row')
axes = &#91;ax1, ax2,ax3, ax4,ax5,ax6,ax7, ax8,ax9, ax10,ax11,ax12]

for i in range(12):
    c = axes&#91;i].contourf(year&#91;'precip'].isel(time=i),cmap='YlGnBu')
    axes&#91;i].set_title(f'{months&#91;i]}',fontsize=12)
    fig.colorbar(c, ax=axes&#91;i], orientation='vertical', fraction=0.1, pad=0.05)</code></pre>



<figure class="wp-block-image alignwide size-full"><img loading="lazy" width="10218" height="8455" src="/uploads/2025/11/image-5.png" alt="" class="wp-image-210"/></figure>



<hr class="wp-block-separator has-alpha-channel-opacity"/>



<h2 class="wp-block-heading">Conclusion</h2>



<p class="wp-block-paragraph">You have now learned how to:</p>



<ul class="wp-block-list">
<li>load vector and raster geospatial data in Python</li>



<li>visualize climate data stored in NetCDF format</li>



<li>clip a global dataset to a region of interest using a shapefile</li>



<li>explore rainfall variation across space and time</li>



<li>generate a series of maps programmatically</li>
</ul>



<p class="wp-block-paragraph">From here, you can compute long-term averages, seasonal trends, anomalies, or even build animations. Python gives you complete control over your workflow &#8211; while keeping everything reproducible and transparent. In the next articles of this series, we&#8217;ll learn how we can create charts, calculate rainfall anomaly, calculate and plot Standardized Precipitation Index (SPI).</p>

