//
//  JSPushRegion.h
//  JoysuchSDK
//
//  Created by seekcy on 2017/1/22.
//  Copyright © 2017年 com.joysuch. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JSPushRegion : NSObject

/*!
 *  @method initWithBuildingIds:floorIds:railIds:userIds
 *
 *  @param buildingIds      建筑id数组
 *  @param floorIds         楼层id数组
 *  @param railIds          围栏id数组
 *  @param userIds          用户id数组
 *
 *  @discussion 单例
 *
 */
- (instancetype)initWithBuildingIds:(NSArray *)buildingIds floorIds:(NSArray *)floorIds railIds:(NSArray *)railIds userIds:(NSArray *)userIds;

/*!
 * @method getUserIds
 *
 * @discussion 获取用户Id数组
 *
 */
- (NSArray *)getUserIds;

/*!
 * @method setUserIdsWithUserIds
 *
 * @param userIds    需要设置的用户id数组
 *
 * @discussion 设置用户Id数组
 *
 */
- (void)setUserIdsWithUserIds:(NSArray *)userIds;

/*!
 * @method addUserIdsWithUserId
 *
 * @param userId    需要添加的用户id
 *
 * @discussion 添加用户Id
 *
 */
- (void)addUserIdsWithUserId:(NSString *)userId;

/*!
 * @method getBuildingIds
 *
 * @discussion 获取建筑Id数组
 *
 */
- (NSArray *)getBuildingIds;

/*!
 * @method setBuildingIdsWithBuildingIds
 *
 * @param buildingIds    需要设置的建筑id数组
 *
 * @discussion 设置建筑Id数组
 *
 */
- (void)setBuildingIdsWithBuildingIds:(NSArray *)buildingIds;


/*!
 * @method addBuildingIdsWithBuildingId
 *
 * @param buildingId    需要添加的建筑id
 *
 * @discussion 添加建筑Id
 *
 */
- (void)addBuildingIdsWithBuildingId:(NSString *)buildingId;

/*!
 * @method getFloorIds
 *
 * @discussion 获取楼层Id数组
 *
 */
- (NSArray *)getFloorIds;

/*!
 * @method setFloorIdsWithFloorIds
 *
 * @param buildingIds    需要设置的楼层id数组
 *
 * @discussion 设置楼层Id数组
 *
 */
- (void)setFloorIdsWithFloorIds:(NSArray *)floorIds;


/*!
 * @method addFloorIdsWithFloorId
 *
 * @param floorId    需要添加的楼层id
 *
 * @discussion 添加楼层Id
 *
 */
- (void)addFloorIdsWithFloorId:(NSString *)floorId;

/*!
 * @method getRailIds
 *
 * @discussion 获取围栏Id数组
 *
 */
- (NSArray *)getRailIds;

/*!
 * @method setRailIdsWithRailIds
 *
 * @param railIds    需要设置的围栏id数组
 *
 * @discussion 设置围栏Id数组
 *
 */
- (void)setRailIdsWithRailIds:(NSArray *)railIds;


/*!
 * @method addRailIdsWithRailId
 *
 * @param railId    需要添加的围栏id
 *
 * @discussion 添加围栏Id
 *
 */
- (void)addRailIdsWithRailId:(NSString *)railId;


@end
