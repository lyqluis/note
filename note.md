##IDE：
集成开发环境（IDE，Integrated Development Environment ）是用于提供程序开发环境的应用程序，一般包括代码编辑器、编译器、调试器和图形用户界面等工具。集成了代码编写功能、分析功能、编译功能、调试功能等一体化的开发软件服务套。所有具备这一特性的软件或者软件套（组）都可以叫集成开发环境。如微软的Visual Studio系列，Borland的C++ Builder、Delphi系列等。该程序可以独立运行，也可以和其它程序并用。IDE多被用于开发HTML应用软件。例如，许多人在设计网站时使用IDE（如HomeSite、DreamWeaver等），因为很多项任务会自动生成。


##网站线框图工具：（UI界面设计）
- mockingbird
- denim
- gliffy
...


##响应式布局：
 自动获取使用者屏幕的大小,并根据屏幕的大小自动调整HTML元素的宽度和高度来适配屏幕
eg. Bootstrap

##vue和jquey对比 
jQuery是使用选择器（$）选取DOM对象，对其进行赋值、取值、事件绑定等操作，其实和原生的HTML的区别只在于可以更方便的选取和操作DOM对象，而数据和界面是在一起的。比如需要获取label标签的内容：
$("lable").val();,它还是依赖DOM元素的值。 
Vue则是通过Vue对象将数据和View完全分离开来了。对数据进行操作不再需要引用相应的DOM对象，可以说数据和View是分离的，他们通过Vue对象这个vm实现相互的绑定。这就是传说中的MVVM
从jquery到vue或者说是到mvvm的转变则是一个思想想的转变，是将原有的直接操作dom的思想转变到操作数据

vue是主要做mvvm，jquery主要做的是解决浏览器兼容性问题和write less do more的问题，当然vue或许也顺便解决了浏览器兼容性问题

vue这类前端数据驱动框架 的思想转变是相对于js来说的，不是相对于jquery来说的。这么说能明白吗？
浏览器端的js有很多问题，不利于开发人员开发。
jquery帮我们屏蔽掉了这些问题，并且提供了很多便捷的api。
但是浏览器端的js操作dom，jquery也是操作dom。
jquery相当于一个工具类，提高了我们的开发效率，但是它提出了什么思想呢？
隐式迭代？链式编程？

要做到动态，界面元素肯定是要根据数据来动态加载的。
使用jq需要拿到数据后操作dom元素来实现，vue直接用v-for来实现，不需要我们来操作dom元素，在这种程度上，我们其实可以说vue实现了model和view的分离

从DOM操作的时代过渡到MVVM时代

 - HTML
	- 所有要取值并提交的空间都应该放在<form></form>内




