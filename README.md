# E-bookData
express+fs+mongoose
mongoDB表Schema：
	nickNm[string]：用户
	store[Array]：书籍收藏列表
	imgUrl[string]：背景图
	title[string]：书籍拼音名称
	bookNm[string]：中文名
	updated_at[date]：数据更新日期
status返回状态集：
	0：服务器返回失败
	1：返回成功
	2：书籍已收藏
	3：书籍已下架
接口：
	/getCollection（获取收藏列表）
		输入：nickNm
		输出：Array
	/delectCollection（删除收藏书籍）
		输入：nickNm，delectall（删除列表）
	/saveCollection（收藏书籍）
		输入:name（用户），title，imgUrl，bookNm
	/latest（最近更新书籍）
	/recommend（推荐书籍）
	/class（书籍分类）
	/bookList（分类列表）
		输入：type（类别）
	/detail（书籍章节列表）
		输入:title
	/section（章节内容）
		输入：title，section
